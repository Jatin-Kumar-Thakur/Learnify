import { clerkClient } from '@clerk/express'
import Course from '../models/courseModel.js';
import { v2 as cloudinary } from 'cloudinary';
import { Purchase } from '../models/PurchaseModel.js';

export const updateRoleToEducator = async (req, res) => {
    try {
        const userId = req.auth.userId;
        await clerkClient.users.updateUserMetadata(userId, {
            publicMetadata: {
                role: 'educator',
            }
        })
        res.status(200).json({
            success: true,
            message: "Now you are an Educator"
        });

    } catch (error) {
        console.log("Error while Updating role educator");
        res.status(400).json({
            success: false,
            message: error.message
        })
    }
}

//Add new course
export const addNewCourse = async (req, res) => {
    try {
        const { courseData } = req.body;
        const imageFile = req.file;
        const educatorId = req.auth.userId;

        if (!imageFile) {
            return res.status(404).json({ status: false, message: "Thumbnail file is not available." })
        }
        const parsedCourseData = await JSON.parse(courseData);
        parsedCourseData.educator = educatorId;

        const newCourse = await Course.create(parsedCourseData);
        const imageUpload = await cloudinary.uploader.upload(imageFile.path);
        newCourse.courseThumbnail = imageUpload.secure_url;
        await newCourse.save()

        return res.status(201).json({ status: true, message: "Course is uploaded" });

    } catch (error) {
        res.status(400).json({ success: false, message: error.message });
    }
}

//Get all educator courses
export const getEducatorCourses = async (req, res) => {
    try {
        const userId = req.auth.userId;
        const courses = await Course.find({ educator: userId });


        return res.status(200).json({ success: true, message: "Course by educutor ID", courses });
    } catch (error) {
        return res.json({ success: false, message: error.message });
    }
}

//Educator dashboard data (Total earning , total courses , courses)

export const educatorDashboardData = async (req, res) => {
    try {
        const userId = req.auth.userId;
        const courses = await Course.find({ educator: userId });
        const totalCourses = courses.length;
        const courseIds = courses.map(course => course._id);

        const purchase = await Purchase.find({
            courseId: { $in: courseIds },
            status: 'completed'
        })

        const totalEarning = purchase.reduce((sum, purchase) => sum + purchase.amount, 0);

        //Unique enrolled students
        const enrolledStudentsData = [];
        for (const course of courses) {
            const students = await User.find({
                _id: { $in: course.enrolledStudents }
            }, 'name imageUrl');

            students.forEach(student => {
                enrolledStudentsData.push({
                    courseTitle: course.courseTitle,
                    student
                })
            })
        }
        res.status(200).json({
            success: true, dashBoardData: {
                totalEarning, enrolledStudentsData, totalCourses
            }
        })
    } catch (error) {
        res.json({ success: false, message: error.message });
    }
}


//Enrolled student data with purchase data
export const enrolledStudentsData = async (req, res) => {
    try {
        const userId = req.auth.userId;
        const courses = await Course.find({ educator: userId });
        const courseIds = courses.map(course => course._id);

        const purchases = await Purchase.find({
            courseId: { $in: courseIds },
            status: 'completed'
        }).populate('userId', 'name imageUrl').populate('courseId', 'courseTitle')

        const enrolledStudents = purchases.map(purchase => ({
            student: purchase.userId,
            courseTitle: purchase.courseId.courseTitle,
            purchaseDate: purchase.createdAt
        }));
        res.status(200).json({ success: true, enrolledStudents });
    } catch (error) {
        res.json({ success: false, message: error.message });
    }
}
import Course from '../models/courseModel.js';
import { CourseProgress } from '../models/courseProgress.js';
import { Purchase } from '../models/PurchaseModel.js';
import { User } from '../models/userModel.js'
import Stripe from 'stripe'

export const getUserData = async (req, res) => {
    try {
        const userId = req.auth.userId;
        const user = await User.findById(userId);
        if (!user) {
            return res.status(404).json({ success: false, message: "User not found." });
        }
        res.status(200).json({ success: true, user });
    } catch (error) {
        res.status(500).json({ success: false, message: error.message });
    }
}

export const getEnrolledCourses = async (req, res) => {
    try {
        const userId = req.auth.userId;
        const userData = await User.findById(userId).populate("enrolledCourses");;

        if (!userData) {
            return res.status(404).json({ success: false, message: "User not found." });
        }
        res.status(200).json({ success: true, enrolledCourses: userData.enrolledCourses })
    } catch (error) {
        res.status(500).json({ success: false, message: error.message });
    }
}



export const purchaseCourse = async (req, res) => {
    try {
        const userId = req.auth.userId;
        const { courseId } = req.body;
        const { origin } = req.headers;
        const userData = await User.findById(userId);
        const courseData = await Course.findById(courseId);
        if (!courseData || !userData) {
            res.status(404).json({ success: false, message: "Data not found" })
        }

        // Calculate amount after discount
        const amount = (courseData.coursePrice - (courseData.discount * courseData.coursePrice) / 100).toFixed(2);

        const purchaseData = {
            courseId: courseData._id,
            userId,
            amount
        }
        const newPurchase = await Purchase.create(purchaseData);
        //Stripe Gateway
        const stripeInstance = new Stripe(process.env.STRIPE_SECRET_KEY);
        const currency = process.env.CURRENCY.toLowerCase();

        //Line items
        const line_items = [{
            price_data: {
                currency,
                product_data: {
                    name: courseData.courseTitle
                },
                unit_amount: Math.floor(amount * 100)
            },
            quantity: 1
        }]
        const session = await stripeInstance.checkout.sessions.create({
            success_url: `${origin}/loading/my-enrollments`,
            cancel_url: `${origin}`,
            line_items: line_items,
            mode: 'payment',
            metadata: {
                purchaseId: newPurchase._id.toString()
            }
        });

        res.status(200).json({ success: true, success_url: session.url })
    } catch (error) {
        res.status(500).json({ success: false, message: error.message });
    }
}


//update progress course

export const updateUserCourseProgress = async (req, res) => {
    try {
        const userId = req.auth.userId;
        const { courseId, lectureId } = req.body;
        const progressData = await CourseProgress.findOne({ userId, courseId });
        if (progressData) {
            if (progressData.lectureCompleted.includes(lectureId)) {
                return res.json({ success: true, message: "Lecture is already completed" });
            }
            progressData.lectureCompleted.push(lectureId);
            await progressData.save();
        }
        else {
            await CourseProgress.create({
                userId,
                courseId,
                lectureCompleted: [lectureId]
            })
        }
        res.json({ success: true, message: 'Progress Updated' })
    } catch (error) {
        res.status(500).json({ success: false, message: error.message });
    }
}

export const getUserCourseProgress = async (req, res) => {
    try {
        const userId = req.auth.userId;
        const { courseId } = req.body;
        const progressData = await CourseProgress.findOne({ userId, courseId });
        console.log("here ",progressData)
        if (!progressData) {
            res.json({ success: false, message: "course progress not available" });
        }
        res.json({ success: true, progressData })
    } catch (error) {
        res.status(500).json({ success: false, message: error.message });
    }
}


//Add user rating
export const addUserRating = async (req, res) => {
    try {
        const userId = req.auth.userId;
        const { courseId, rating } = req.body;
        if (!userId || !courseId || !rating || rating < 1 || rating > 5) {
            res.json({ success: false, message: "Invalid details" });
        }
        const course = await Course.findById(courseId);
        if (!course) {
            res.json({ success: false, message: "Course not found" });
        }

        const user = await User.findById(userId);

        if (!user || !user.enrolledCourses.includes(courseId)) {
            res.json({ success: false, message: "User has not purchased this course" })
        }


        const isRated = course.courseRating.findIndex((i) => {
            i.userId === userId
        })
        if (isRated > -1) {
            course.courseRating[isRated].rating = rating;
        }
        else {
            course.courseRating.push({ userId, rating });
        }
        await course.save();
        res.json({ success: true, message: "Rating added" })
    } catch (error) {
        res.status(500).json({ success: false, message: error.message });
    }
}
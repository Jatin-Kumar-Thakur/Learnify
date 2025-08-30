import Course from "../models/courseModel.js";

//Get all Courses
export const getCourses = async (req, res) => {
    try {
        const courses = await Course.find({ isPublished: true }).select([
            '-courseContent', -'enrolledStudents'
        ]).populate({ path: 'educator' });
        res.status(200).json({ success: true, courses });
    } catch (error) {
        res.json({ success: false, message: error.message });
    }
}

//Get Course by ID

export const getCourseById = async (req, res) => {
    try {
        const { id } = req.params;
        const courseData = await Course.findById(id).populate({ path: 'educator' })

        //remove course url is previewfalse
        courseData.courseContent.forEach((chapter) => {
            chapter.chapterContent.forEach((lecture) => {
                if (!lecture.isPreviewFree) {
                    lecture.lectureUrl = ''
                }
            })
        })
        res.status(200).json({ success: true, courseData });
    } catch (error) {
        res.json({ success: false, message: error.message });
    }
}


import mongoose, { Schema } from "mongoose";

const lectureSchema = new mongoose.Schema({
    lectureId: {
        type: String,
        required: true
    },
    lectureTitle: {
        type: String,
        required: true
    },
    lectureDuration: {
        type: Number,
        required: true,
        min: 0
    },
    lectureUrl: {
        type: String,
        required: true
    },
    isPreviewFree: {
        type: Boolean,
        default: false,
        required: true
    },
    lectureOrder: {
        type: Number,
        required: true
    }
}, { _id: false });

const chapterSchema = new mongoose.Schema({
    chapterId: {
        type: String,
        required: true
    },
    chapterTitle: {
        type: String,
        required: true
    },
    chapterOrder: {
        type: Number,
        required: true
    },
    chapterContent: [lectureSchema]
}, { _id: false })

const courseSchema = new Schema({
    courseTitle: {
        type: String,
        required: true,
    },
    courseDescription: {
        type: String,
        required: true,
    },
    courseThumbnail: {
        type: String
    },
    coursePrice: {
        type: Number,
        required: true,
        min: 0
    },
    isPublished: {
        type: Boolean,
        default: true,
    },
    discount: {
        type: Number,
        min: 0,
        max: 100,
        default: 0
    },
    courseContent: [chapterSchema],
    courseRating: [
        {
            userId: { type: String },
            rating: { type: Number, min: 1, max: 5 },
        }
    ],
    educator: {
        type: String,
        ref: 'User',
        required: true
    },
    enrolledStudents: [
        {
            type: String,
            ref: 'User',
        }
    ]
}, { timestamps: true, minimize: false });

const Course = mongoose.model("Course", courseSchema);
export default Course;
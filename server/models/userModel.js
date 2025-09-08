import mongoose, { Schema } from "mongoose";

const userSchema = new Schema({
    _id: { type: String, require: true },
    name: { type: String, require: true },
    email: { type: String, require: true },
    imageUrl: { type: String, require: true },
    enrolledCourses: [
        {
            type: mongoose.Schema.Types.ObjectId,
            ref: "Course"
        }
    ],

}, { timestamps: true });

export const User = mongoose.model("User", userSchema);
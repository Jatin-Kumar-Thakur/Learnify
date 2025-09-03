import express from 'express';
import {
    addUserRating,
    getEnrolledCourses,
    getUserCourseProgress,
    getUserData,
    purchaseCourse,
    updateUserCourseProgress
} from '../controllers/userController.js';

const userRoute = express.Router();
userRoute.get('/data', getUserData);
userRoute.get('/enrolled-courses', getEnrolledCourses);
userRoute.post('/purchase', purchaseCourse);
userRoute.post('/update-course-progress', updateUserCourseProgress);
userRoute.post('/get-course-progress', getUserCourseProgress);
userRoute.post('/add-rating', addUserRating);

export default userRoute;
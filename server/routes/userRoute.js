import express from 'express';
import { getEnrolledCourses, getUserData, purchaseCourse } from '../controllers/userController.js';

const userRoute = express.Router();
userRoute.get('/data', getUserData);
userRoute.get('/enrolled-courses', getEnrolledCourses);
userRoute.post('/purchase', purchaseCourse);

export default userRoute;
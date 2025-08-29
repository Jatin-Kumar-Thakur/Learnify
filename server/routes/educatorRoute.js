import upload from "../configs/multer.js";
import { addNewCourse, educatorDashboardData, enrolledStudentsData, getEducatorCourses, updateRoleToEducator } from "../controllers/educatorController.js";
import express from 'express'
import { protectEducator } from "../middleware/authMiddleware.js";

const educatorRoute = express.Router();

educatorRoute.get('/update-role', updateRoleToEducator);
educatorRoute.post('/add-course', upload.single('image'), protectEducator, addNewCourse);
educatorRoute.get('/get-courses', protectEducator, getEducatorCourses);
educatorRoute.get('/dashboard', protectEducator, educatorDashboardData);
educatorRoute.get('/enrolled-students', protectEducator, enrolledStudentsData);

export default educatorRoute;
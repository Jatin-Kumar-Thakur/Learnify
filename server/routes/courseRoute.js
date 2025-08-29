import express from 'express';
import { getCourseById, getCourses } from '../controllers/courseController.js';

const courseRoute = express.Router();

courseRoute.get('/all', getCourses);
courseRoute.get('/:id', getCourseById);


export default courseRoute;
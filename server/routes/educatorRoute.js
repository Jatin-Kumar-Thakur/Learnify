import { updateRoleToEducator } from "../controllers/educatorController.js";
import express from 'express'

const educatorRoute = express.Router();

educatorRoute.get('/update-role', updateRoleToEducator);

export default educatorRoute;
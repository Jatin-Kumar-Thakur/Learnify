import Course from '../models/courseModel.js';
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
        const userData = await User.findById(userId);

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
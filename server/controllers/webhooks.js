import { Webhook } from "svix";
import { User } from "../models/userModel.js";
import Stripe from "stripe";
import { Purchase } from "../models/PurchaseModel.js";
import Course from "../models/courseModel.js";
import dotenv from 'dotenv';

dotenv.config()

//This is used when User is created/updated/deleted on clerk side
//when ever a event happen on clerk side this clerk sends a webhook to do the same in mongodb data
export const clerkWebhooks = async (req, res) => {

    //Here we verify that the request is valid or not with clerk webhook secret
    // Your backend receives Clerk webhooks when a user is created/updated/deleted.
    // Svix verifies that the webhook is genuine.
    // Based on event type:
    // user.created → add user in MongoDB.
    // user.updated → update user in MongoDB.
    // user.deleted → delete user from MongoDB.
    // Keeps your local DB in sync with Clerk’s user database.
    try {
        const whook = new Webhook(process.env.CLERK_WEBHOOK_SECRET);

        const payload = req.body.toString(); // raw body
        const headers = {
            "svix-id": req.headers["svix-id"],
            "svix-timestamp": req.headers["svix-timestamp"],
            "svix-signature": req.headers["svix-signature"],
        };

        // Verify webhook and extract event
        const evt = whook.verify(payload, headers);
        const { data, type } = evt;

        switch (type) {
            case "user.created": {
                const userData = {
                    _id: data.id,
                    email: data.email_addresses[0].email_address,
                    name: `${data.first_name} ${data.last_name}`,
                    imageUrl: data.image_url,
                };
                await User.create(userData);
                return res.status(200).json({ success: true });
            }

            case "user.updated": {
                const _id = data.id;
                const userData = {
                    email: data.email_addresses[0].email_address,
                    name: `${data.first_name} ${data.last_name}`,
                    imageUrl: data.image_url,
                };
                await User.findByIdAndUpdate(_id, userData);
                return res.status(200).json({ success: true });
            }

            case "user.deleted": {
                await User.findByIdAndDelete(data.id);
                return res.status(200).json({ success: true });
            }

            default:
                return res.status(200).json({ success: true });
        }
    } catch (error) {
        return res.status(400).json({ success: false, message: error.message });
    }
};


const stripeInstance = new Stripe(process.env.STRIPE_SECRET_KEY);

export const stripeWebhooks = async (req, res) => {
    const sig = req.headers["stripe-signature"];
    let event;

    try {
        // ✅ use raw request body
        event = stripeInstance.webhooks.constructEvent(
            req.body,
            sig,
            process.env.STRIPE_WEBHOOK_SECRET
        );
    } catch (error) {
        console.error("❌ Webhook signature verification failed:", error.message);
        return res.status(400).send(`Webhook Error: ${error.message}`);
    }

    console.log("📩 Event received:", event.type);

    try {
        switch (event.type) {
            case "checkout.session.completed": {
                const session = event.data.object;
                console.log("✅ Checkout session completed:", session.id);

                // retrieve purchaseId from metadata
                const { purchaseId } = session.metadata || {};
                if (!purchaseId) {
                    console.error("⚠️ No purchaseId found in session metadata");
                    break;
                }

                const purchaseData = await Purchase.findById(purchaseId);
                if (!purchaseData) {
                    console.error("⚠️ Purchase not found:", purchaseId);
                    break;
                }

                const userData = await User.findById(purchaseData.userId);
                const courseData = await Course.findById(
                    purchaseData.courseId.toString()
                );

                if (userData && courseData) {
                    // update course
                    if (!courseData.enrolledStudents.includes(userData._id)) {
                        courseData.enrolledStudents.push(userData._id);
                        await courseData.save();
                    }

                    // update user
                    if (!userData.enrolledCourses.includes(courseData._id)) {
                        userData.enrolledCourses.push(courseData._id);
                        await userData.save();
                    }

                    // update purchase
                    purchaseData.status = "completed";
                    await purchaseData.save();

                    console.log("🎉 User enrolled successfully:", userData._id);
                }
                break;
            }

            case "checkout.session.expired":
                console.log("❌ Checkout session expired");
                break;

            case "payment_intent.payment_failed": {
                const paymentIntent = event.data.object;
                const sessionList = await stripeInstance.checkout.sessions.list({
                    payment_intent: paymentIntent.id,
                });

                if (sessionList.data.length > 0) {
                    const { purchaseId } = sessionList.data[0].metadata || {};
                    if (purchaseId) {
                        const purchaseData = await Purchase.findById(purchaseId);
                        if (purchaseData) {
                            purchaseData.status = "failed";
                            await purchaseData.save();
                        }
                    }
                }
                console.log("❌ Payment failed");
                break;
            }

            default:
                console.log(`⚠️ Unhandled event type ${event.type}`);
        }

        res.json({ received: true });
    } catch (err) {
        console.error("🔥 Webhook handler error:", err.message);
        res.status(500).send("Webhook handler failed");
    }
};


// const stripeInstance = new Stripe(process.env.STRIPE_SECRET_KEY);

// export const stripeWebhooks = async (request, response) => {
//     const sig = request.headers['stripe-signature'];
//     let event;
//     try {
//         // event = Stripe.webhooks.constructEvent(request.body, sig, process.env.STRIPE_WEBHOOK_SECRET);
//         event = stripeInstance.webhooks.constructEvent(
//             request.body,
//             sig,
//             process.env.STRIPE_WEBHOOK_SECRET
//         );
//     } catch (error) {
//         response.status(400).send(`webhook Error :${error.message}`)
//     }

//     // Handle the event
//     console.log("📩 Event received:", event.type);


//     switch (event.type) {
//         case "checkout.session.completed": {
//             const session = event.data.object;

//             // ✅ your purchaseId is here
//             const { purchaseId } = session.metadata;

//             const purchaseData = await Purchase.findById(purchaseId);
//             const userData = await User.findById(purchaseData.userId);
//             const courseData = await Course.findById(purchaseData.courseId.toString());

//             courseData.enrolledStudents.push(userData._id);
//             await courseData.save();

//             userData.enrolledCourses.push(courseData._id);
//             await userData.save();

//             purchaseData.status = "completed";
//             await purchaseData.save();

//             console.log("✅ Checkout session completed and course enrolled");
//             break;
//         }

//         case "checkout.session.expired":
//             console.log("❌ Checkout session expired");
//             break;

//         case "payment_intent.payment_failed": {
//             const paymentIntent = event.data.object;
//             const sessionList = await stripeInstance.checkout.sessions.list({
//                 payment_intent: paymentIntent.id,
//             });

//             if (sessionList.data.length > 0) {
//                 const { purchaseId } = sessionList.data[0].metadata;
//                 const purchaseData = await Purchase.findById(purchaseId);
//                 purchaseData.status = "failed";
//                 await purchaseData.save();
//             }

//             console.log("❌ Payment failed");
//             break;
//         }

//         default:
//             console.log(`Unhandled event type ${event.type}`);
//     }




//     response.json({ received: true });
// }


// switch (event.type) {
//     case 'payment_intent.succeeded':
//         const paymentIntent = event.data.object;
//         const paymentIntentId = paymentIntent.id;
//         const session = await stripeInstance.checkout.sessions.list({
//             payment_intent: paymentIntentId
//         })
//         const { purchaseId } = session.data[0].metadata;
//         const purchaseData = await Purchase.findById(purchaseId);
//         const userData = await User.findById(purchaseData.userId);
//         const courseData = await Course.findById(purchaseData.courseId.toString());

//         courseData.enrolledStudents.push(userData._id);
//         await courseData.save();

//         userData.enrolledCourses.push(courseData._id);
//         await userData.save();

//         purchaseData.status = 'completed';
//         await purchaseData.save();
//         console.log('PaymentIntent was successful!');
//         break;
//     case 'payment_intent.payment_failed': {
//         const paymentIntent = event.data.object;
//         const paymentIntentId = paymentIntent.id;
//         const session = await stripeInstance.checkout.sessions.list({
//             payment_intent: paymentIntentId
//         })
//         const { purchaseId } = session.data[0].metadata;
//         const purchaseData = await Purchase.findById(purchaseId);
//         purchaseData.status = 'failed';
//         await purchaseData.save();

//     }
//         break;
//     // ... handle other event types
//     default:
//         console.log(`Unhandled event type ${event.type}`);
// }

// Return a response to acknowledge receipt of the event

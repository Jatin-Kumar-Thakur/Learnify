import { Webhook } from "svix";
import { User } from "../models/userModel.js";


//This is used when User is created/updated/deleted on clerk side
//when ever a event happen on clerk side this clerk sends a webhook to do the same in mongodb data
export const clerkWebhooks = async (req, res) => {
    try {

        //Here we verify that the request is valid or not with clerk webhook secret
        // Your backend receives Clerk webhooks when a user is created/updated/deleted.
        // Svix verifies that the webhook is genuine.
        // Based on event type:
        // user.created → add user in MongoDB.
        // user.updated → update user in MongoDB.
        // user.deleted → delete user from MongoDB.
        // Keeps your local DB in sync with Clerk’s user database.
        const whook = new Webhook(process.env.CLERK_WEBHOOK_SECRET);
        await whook.verify(JSON.stringify(req.body), {
            "svix-id": req.headers["svix-id"],
            "svix-timestamp": req.headers["svix-timestamp"],
            "svix-signature": req.headers["svix-signature"],
        })
        const { data, type } = req.body;
        switch (type) {
            case 'user.created': {
                const userData = {
                    _id: data.id,
                    email: data.email_address[0].email_address,
                    name: data.first_name + " " + data.last_name,
                    imageUrl: data.image_url
                }
                await User.create(userData);
                res.json({});
                break;
            }

            case 'user.updated': {
                const _id = data.id;
                const userData = {
                    email: data.email_address[0].email_address,
                    name: data.first_name + " " + data.last_name,
                    imageUrl: data.image_url
                }
                await User.findByIdAndUpdate(_id, userData);
                res.json({});
                break;
            }

            case 'user.deleted': {
                const _id = data.id;
                await User.findByIdAndDelete(_id);
                res.json({});
                break;
            }

            default:
                break;
        }
    } catch (error) {
        res.json({ success: false, message: error.message });
    }
}
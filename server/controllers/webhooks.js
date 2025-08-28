import { Webhook } from "svix";
import { User } from "../models/userModel.js";


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

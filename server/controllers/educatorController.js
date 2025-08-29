import { clerkClient } from '@clerk/express'

export const updateRoleToEducator = async (req, res) => {
    try {
        const userId = req.auth.userId;
        await clerkClient.users.updateUserMetadata(userId, {
            publicMetadata: {
                role: 'educator',
            }
        })
        res.status(200).json({
            success: true,
            message: "Now you are an Educator"
        });

    } catch (error) {
        console.log("Error while Updating role educator");
        res.status(400).json({
            success: false,
            message: error.message
        })
    }
}
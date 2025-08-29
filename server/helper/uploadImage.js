const uploadImage = async (imagePath) => {
    try {
        const result = await cloudinary.uploader.upload(imagePath, {
            use_filename: true, // Use the original filename as public ID
            unique_filename: false, // Don't add a unique suffix to the filename
            overwrite: true // Overwrite if an asset with the same public ID exists
        });
        console.log(result); // Contains details of the uploaded image
        return result.secure_url; // URL of the uploaded image
    } catch (error) {
        console.error(error);
    }
};

export default uploadImage;
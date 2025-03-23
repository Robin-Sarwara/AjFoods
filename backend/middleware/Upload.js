const cloudinary = require('cloudinary').v2;
const {CloudinaryStorage } = require('multer-storage-cloudinary');
const multer = require('multer');
require('dotenv').config();

cloudinary.config({
    cloud_name: process.env.CLOUDINARY_CLOUD_NAME,
    api_key: process.env.CLOUDINARY_API_KEY,
    api_secret: process.env.CLOUDINARY_API_SECRET,
});

const storage = new CloudinaryStorage({
    cloudinary,
    params: {
        folder: 'food-products',
        allowed_formats: ['jpg', 'png', 'jpeg', 'webp'], 
    }
});
const upload = multer({ storage });



const deleteProductImages = async (product) => {
    try {
        if (!product.imageUrls || product.imageUrls.length === 0) return;

        const imagePublicIds = product.imageUrls.map(url => {
            const parts = url.split("/");
            return parts[parts.length - 1].split(".")[0]; // Extract public ID
        });

        for (const publicId of imagePublicIds) {
            const response = await cloudinary.uploader.destroy(`food-products/${publicId}`);
        }
    } catch (error) {
        console.error("Error deleting images:", error);
    }
};


module.exports = {upload,deleteProductImages};
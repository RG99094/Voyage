// voyage-backend/config/cloudinary.js
const cloudinary = require("cloudinary").v2;
const { CloudinaryStorage } = require("multer-storage-cloudinary");
const multer = require("multer");

// Configure Cloudinary
cloudinary.config({
    cloud_name: process.env.CLOUDINARY_CLOUD_NAME,
    api_key: process.env.CLOUDINARY_API_KEY,
    api_secret: process.env.CLOUDINARY_API_SECRET,
});

/**
 * Creates a multer upload middleware configured for Cloudinary.
 * @param {string} folder - The Cloudinary folder to upload to (e.g., 'voyage/packages')
 * @param {string} fieldName - The form field name for the file (e.g., 'image')
 * @param {number} maxSize - Max file size in bytes (default: 10MB)
 * @returns {Function} multer middleware
 */
const createUpload = (folder, fieldName, maxSize = 10 * 1024 * 1024) => {
    const storage = new CloudinaryStorage({
        cloudinary,
        params: {
            folder,
            allowed_formats: ["jpg", "jpeg", "png", "gif", "webp", "svg", "pdf"],
        },
    });

    return multer({ storage, limits: { fileSize: maxSize } }).single(fieldName);
};

module.exports = { cloudinary, createUpload };

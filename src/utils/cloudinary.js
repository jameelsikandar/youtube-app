import { v2 as cloudinary } from "cloudinary";
import fs from "fs";

cloudinary.config({
    cloud_name: process.env.CLOUDINARY_CLOUD_NAME,
    api_key: process.env.CLOUDINARY_API_KEY,
    api_secret: process.env.CLOUDINARY_API_SECRET
});

/**
 * Upload file to Cloudinary using either:
 * - buffer (from memoryStorage)
 * - local file path (from diskStorage)
 */
export const uploadOnCloudinary = (fileInput, folder, resource_type = "auto") => {
    return new Promise((resolve, reject) => {
        const options = { folder, resource_type };

        // 🧠 If fileInput is a buffer
        if (Buffer.isBuffer(fileInput)) {
            const stream = cloudinary.uploader.upload_stream(options, (error, result) => {
                if (error) return reject(error);
                resolve(result);
            });
            stream.end(fileInput);
        }

        // 📁 If fileInput is a local file path
        else if (typeof fileInput === "string") {
            cloudinary.uploader.upload(fileInput, options)
                .then(result => {
                    fs.unlink(fileInput, () => { }); // delete local file
                    resolve(result);
                })
                .catch(err => {
                    fs.unlink(fileInput, () => { }); // delete even on failure
                    reject(err);
                });
        }

        // ❌ Invalid input
        else {
            reject(new Error("Invalid file input. Must be a buffer or file path."));
        }
    });
};

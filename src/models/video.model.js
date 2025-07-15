import mongoose, { mongo, Schema } from "mongoose";


const videoSchema = new Schema(
    {
        owner: {
            type: Schema.Types.ObjectId,
            ref: "User"
        },
        videoFile: {
            type: String,
        },
        thumbnail: {
            type: String,
            required: true
        },
        title: {
            type: String,
            required: true
        },
        descripition: {
            type: String,
            required: true
        },
        duration: {
            type: Number,
            required: true
        },
        views: {
            type: Number,
            default: 0
        },
        isPublished: {
            type: Boolean,
            default: true,
        }
    },
    {
        timestamps: true
    }
);


export const Video = mongoose.model('Video', videoSchema)
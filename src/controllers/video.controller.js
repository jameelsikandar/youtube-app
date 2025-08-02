import { Video } from '../models/video.model.js'
import { uploadOnCloudinary } from '../utils/cloudinary.js'
import { asyncHandler } from '../utils/asyncHandler.js'
import { ApiError } from '../utils/ApiError.js'
import { ApiResponse } from '../utils/ApiResponse.js'
import mongoose from 'mongoose'


// publish a video
const publishAvideo = asyncHandler(async (req, res) => {
    const { title, descripition, duration } = req.body;

    const videoFile = req.files?.videoFile?.[0];
    const thumbnail = req.files?.thumbnail?.[0];

    if (!(title || descripition || duration)) {
        throw new ApiError(400, "All fields are required")
    }

    const uploadedVideo = await uploadOnCloudinary(videoFile.path, "videos", "video");
    const uploadedThumbnail = await uploadOnCloudinary(thumbnail.path, "thumbnails", "image");

    if (!(uploadedVideo?.secure_url || uploadedThumbnail?.secure_url)) {
        throw new ApiError(500, "Cloud upload failed")
    }

    const video = await Video.create({
        owner: req.user._id,
        title,
        descripition,
        duration,
        videoFile: uploadedVideo.secure_url,
        thumbnail: uploadedThumbnail.secure_url
    });

    return res
        .status(200).json(
            new ApiResponse(200, video, "Video uploaded successfully")
        )
});

// get all video
const getAllVideos = asyncHandler(async (req, res) => {
    const { page = 1, limit = 10 } = req.query;

    const skip = (parseInt(page - 1) * parseInt(limit));

    const videos = await Video.aggregate([
        {
            $match: {
                isPublished: true
            }
        },
        {
            $sort: {
                createdAt: -1
            }
        },
        {
            $skip: skip
        },
        {
            $limit: parseInt(limit)
        },
        {
            $lookup: {
                from: "users",
                localField: "owner",
                foreignField: "_id",
                as: "owner"
            }
        },
        {
            $unwind: "$owner"
        },
        {
            $project: {
                title: 1,
                thumbnail: 1,
                createdAt: 1,
                "owner.username": 1,
                "owner.avatar": 1
            }
        }
    ]);

    const totalVideos = await Video.countDocuments({ isPublished: true })

    return res
        .status(200)
        .json(new ApiResponse(
            200,
            {
                totalVideos: totalVideos,
                page: parseInt(page),
                limit: parseInt(limit),
                videos
            },
            "All published videos fetched successfully!"
        ))
});

// get a video by id
const getVideoById = asyncHandler(async (req, res) => {
    const { videoId } = req.params

    const video = await Video.findById(videoId)
        .populate('owner', 'username fullName')
        .exec();

    if (!video) {
        throw new ApiError(400, "No video found!")
    }

    return res
        .status(200)
        .json(new ApiResponse(200, video, "Video fetched successfully!"))


})

// update video title, description
const updateVideoDetails = asyncHandler(async (req, res) => {
    const { videoId } = req.params;
    const { title, descripition } = req.body;

    if (!(title || descripition)) {
        throw new ApiError(400, "Title or descripition is required!")
    }

    const video = await Video.findById(videoId);

    if (!video) {
        throw new ApiError(400, "Video not found!")
    }

    video.title = title;
    video.descripition = descripition;

    const updatedVideoDetails = await video.save();

    return res
        .status(200)
        .json(
            new ApiResponse(200, updatedVideoDetails, "Changes updated successfully!")
        )
})

// delete a video
const deleteVideo = asyncHandler(async (req, res) => {
    const { videoId } = req.params

    const video = await Video.findById(videoId);

    if (!video) {
        throw new ApiError(400, "Video not found")
    }

    if (video.owner.toString() !== req.user._id.toString()) {
        throw new ApiError(400, "You can only delete your own videos")
    }

    await video.deleteOne();

    return res
        .status(200)
        .json(
            new ApiResponse(200, video, "Video deleted successfully!")
        )
})

// change publish status
const togglePublishStatus = asyncHandler(async (req, res) => {
    const { videoId } = req.params;

    const video = await Video.findById(videoId);

    if (!video) {
        throw new ApiError(400, "Video not found!")
    }

    video.isPublished = !video.isPublished;


    const statusMessage = video.isPublished
        ? "Video published!"
        : "Video unpublished!";

    await video.save();

    return res
        .status(200)
        .json(
            new ApiResponse(200, statusMessage, "Published status changed!")
        )
});

export { publishAvideo, getVideoById, updateVideoDetails, togglePublishStatus, deleteVideo, getAllVideos }
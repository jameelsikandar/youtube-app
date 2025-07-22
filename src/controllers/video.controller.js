import { Video } from '../models/video.model.js'
import { uploadOnCloudinary } from '../utils/cloudinary.js'
import { asyncHandler } from '../utils/asyncHandler.js'
import { ApiError } from '../utils/ApiError.js'
import { ApiResponse } from '../utils/ApiResponse.js'


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
    const { page = 1, limit = 10, query, sortBy, sortType, userId } = req.query
    //TODO: get all videos based on query, sort, pagination
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
    //TODO: delete video
})

// change publish status
const togglePublishStatus = asyncHandler(async (req, res) => {
    const { videoId } = req.params
})

export { publishAvideo, getVideoById, updateVideoDetails }
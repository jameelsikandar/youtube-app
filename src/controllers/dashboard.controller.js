import mongoose from "mongoose";
import { Like } from '../models/like.model.js'
import { ApiError } from "../utils/ApiError.js";
import { ApiResponse } from "../utils/ApiResponse.js";
import { asyncHandler } from "../utils/asyncHandler.js";
import { Video } from '../models/video.model.js'
import { Subscripition } from '../models/subscripition.model.js'
import { User } from '../models/user.model.js';
import { Comment } from '../models/comment.model.js';


// get channel stats
const getChannelStats = asyncHandler(async (req, res) => {
    const { channelId } = req.params;

    if (!mongoose.Types.ObjectId.isValid(channelId)) {
        throw new ApiError(400, "Channel id is invalid")
    }

    const channel = await User.findById(channelId);

    if (!channel) {
        throw new ApiError(400, "Channel not found!")
    }

    const totalSubscribers = await Subscripition.countDocuments({ channel: channelId });

    const videos = await Video.find({ owner: channelId });

    const totalVideos = videos.length;

    const totalViews = videos.reduce((acc, video) => acc + video.views, 0);

    const videoIds = videos.map(video => video._id);

    const totalComments = await Comment.countDocuments({ video: { $in: videoIds } });

    const totalLikes = await Like.countDocuments({ video: { $in: videoIds } });

    return res
        .status(200)
        .json(new ApiResponse(
            200,
            {
                "Subscribers": totalSubscribers,
                "Videos": videos,
                "Total Videos": totalVideos,
                "Total Views": totalViews,
                "Total Comments": totalComments,
                "Total Likes": totalLikes
            },
            "Stats fetched successfully!"
        ))
});


// channel videos
const getChannelVideos = asyncHandler(async (req, res) => {
    const { channelId } = req.params;

    if (!mongoose.Types.ObjectId.isValid(channelId)) {
        throw new ApiError(400, "Channel id is invalid")
    }

    const channel = await User.findById(channelId);

    if (!channel) {
        throw new ApiError(400, "Channel not found!")
    }

    if (channel._id.toString() !== req.user._id.toString()) {
        throw new ApiError(404, "You can only access your own channel stats!")
    }

    const videos = await Video.find({ owner: channelId })
        .select("thumbnail title descripition createdAt")

    return res
        .status(200)
        .json(new ApiResponse(
            200,
            { "Total Videos ": videos.length, videos },
            "Videos fetched successfully!"
        ))
});


export { getChannelStats, getChannelVideos }
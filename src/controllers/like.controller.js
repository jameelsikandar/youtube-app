import mongoose from "mongoose";
import { Like } from '../models/like.model.js'
import { ApiError } from "../utils/ApiError.js";
import { ApiResponse } from "../utils/ApiResponse.js";
import { asyncHandler } from "../utils/asyncHandler.js";
import { Video } from '../models/video.model.js'


const toggleVideoLike = asyncHandler(async (req, res) => {
    const { videoId } = req.params;
    const userId = req.user._id;

    const video = await Video.findById(videoId);
    if (!video) throw new ApiError(404, "Video not found");

    const existingLike = await Like.findOne({
        video: videoId,
        likedBy: userId
    })

    if (existingLike) {
        await existingLike.deleteOne();
        const totalLikes = await Like.countDocuments({ video: videoId });

        return res
            .status(200)
            .json(new ApiResponse(200, { liked: false, totalLikes }, "Video unliked!"))
    }

    await Like.create({
        video: videoId,
        likedBy: userId
    })

    const totalLikes = await Like.countDocuments({ video: videoId });

    return res
        .status(200)
        .json(new ApiResponse(200, { liked: true, totalLikes }, "Video liked!"))

});


const toggleTweetLike = asyncHandler(async (req, res) => {
    const { tweetId } = req.params;
    const userId = req.user._id;

    const tweet = Like.findById(tweetId)
    if (!tweet) throw new ApiError(404, "Tweet not found");

    const existingLike = await Like.findOne({
        tweet: tweetId,
        likedBy: userId
    });

    if (existingLike) {
        await existingLike.deleteOne();
        const totalLikes = await Like.countDocuments({ tweet: tweetId })

        return res
            .status(200)
            .json(new ApiResponse(200, { liked: false, totalLikes }, "Tweet unliked!"))
    }

    await Like.create({
        tweet: tweetId,
        likedBy: userId
    });

    const totalLikes = await Like.countDocuments({ tweet: tweetId })

    return res.status(200).json(new ApiResponse(200, { liked: true, totalLikes }, "Tweet Liked"))

})


const toggleCommentLike = asyncHandler(async (req, res) => {
    const { commentId } = req.params;
    const userId = req.user._id;

    const comment = Like.findById(commentId)
    if (!comment) throw new ApiError(404, "Comment not found");

    const existingLike = await Like.findOne({
        comment: commentId,
        likedBy: userId
    });

    if (existingLike) {
        await existingLike.deleteOne();
        const totalLikes = await Like.countDocuments({ comment: commentId })

        return res
            .status(200)
            .json(new ApiResponse(200, { liked: false, totalLikes }, "Comment unliked!"))
    }

    await Like.create({
        comment: commentId,
        likedBy: userId
    });

    const totalLikes = await Like.countDocuments({ comment: commentId })

    return res.status(200).json(new ApiResponse(200, { liked: true, totalLikes }, "Comment Liked"))

})



export { toggleVideoLike, toggleTweetLike, toggleCommentLike }
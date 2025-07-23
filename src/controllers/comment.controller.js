import mongoose from "mongoose";
import { ApiError } from "../utils/ApiError.js";
import { ApiResponse } from "../utils/ApiResponse.js";
import { asyncHandler } from "../utils/asyncHandler.js";
import { Video } from "../models/video.model.js";
import { Comment } from '../models/comment.model.js'

// add comment on a video
const addComment = asyncHandler(async (req, res) => {
    const { videoId } = req.params
    const { content } = req.body

    if (!content) {
        throw new ApiError(400, "Content is required!")
    }

    const video = await Video.findById(videoId)

    if (!video) {
        throw new ApiError(400, "Video not found");
    }

    const comment = await Comment.create({
        content,
        video: videoId,
        owner: req.user._id
    });

    return res.status(200)
        .json(new ApiResponse(200, comment, "Comment added successfully!"))

});

// delete comment
const deleteComment = asyncHandler(async (req, res) => {
    const { commentId } = req.params;

    if (!mongoose.Types.ObjectId.isValid(commentId)) {
        throw new ApiError(400, "Invalid comment ID format!")
    }

    const comment = await Comment.findById(commentId);

    if (!comment) {
        throw new ApiError(404, "Comment not found")
    }

    if (comment.owner.toString() !== req.user._id.toString()) {
        throw new ApiError(400, "You can only delete your own comments")
    }

    await comment.deleteOne();

    return res
        .status(200)
        .json(new ApiResponse(200, comment, "Comment deleted successfully!"))
});

const updateComment = asyncHandler(async (req, res) => {
    const { commentId } = req.params;
    const { content } = req.body;

    if (!mongoose.Types.ObjectId.isValid(commentId)) {
        throw new ApiError(404, "Invalid comment id format")
    }

    if (!content) {
        throw new ApiError(400, "Content is required")
    }

    const comment = await Comment.findById(commentId);

    if (!comment) {
        throw new ApiError(404, "Comment not found!")
    }

    if (comment.owner.toString() !== req.user._id.toString()) {
        throw new ApiError(400, "You can only update your own comments!")
    };

    comment.content = content;

    const updatedComment = await comment.save();

    return res
        .status(200)
        .json(new ApiResponse(200, updatedComment, "Comment updated successfully!"))
});

// get video comments
const getVideoComments = asyncHandler(async (req, res) => {
    const { videoId } = req.params;
    const { page = 1, limit = 10 } = req.query;

    const skip = (parseInt((page) - 1) * parseInt(limit));

    const comments = await Comment.aggregate([
        {
            $match: {
                video: new mongoose.Types.ObjectId(videoId)
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
                from: 'users',
                localField: 'owner',
                foreignField: '_id',
                as: 'ownerData'
            }
        },
        {
            $unwind: '$ownerData'
        },
        {
            $project: {
                title: 1,
                content: 1,
                createdAt: 1,
                'ownerData.username': 1
            }
        }
    ]);

    const totalComments = await Comment.countDocuments({ video: new mongoose.Types.ObjectId(videoId) })

    return res
        .status(200)
        .json(new ApiResponse(200, { TotalComments: totalComments, comments }, "Comments fetched successfully!"))
});




export {
    addComment,
    deleteComment,
    updateComment,
    getVideoComments
}
import mongoose from "mongoose";
import { Tweet } from '../models/tweet.model.js';
import { ApiError } from "../utils/ApiError.js";
import { ApiResponse } from "../utils/ApiResponse.js";
import { asyncHandler } from "../utils/asyncHandler.js";

// post a tweet
const postTweet = asyncHandler(async (req, res) => {
    const { content } = req.body;

    if (!content) {
        throw new ApiError(400, "Tweet content is required!")
    }

    const tweet = await Tweet.create({
        content,
        owner: req.user._id
    });

    return res.status(200)
        .json(new ApiResponse(200, tweet, "Tweet posted successfully!"))
});

// update tweet
const updateTweet = asyncHandler(async (req, res) => {
    const { tweetId } = req.params;
    const { content } = req.body;

    if (!(content || mongoose.Types.ObjectId.isValid(tweetId))) {
        throw new ApiError(400, "Content is required! || tweetId is invalid")
    }

    const tweet = await Tweet.findById(tweetId);

    if (!tweet) {
        throw new ApiError(400, "Tweet not found!")
    }

    if (tweet.owner.toString() !== req.user._id.toString()) {
        throw new ApiError(404, "You can ony update your own tweets")
    }

    tweet.content = content;

    const updatedTweet = await tweet.save();

    return res
        .status(200)
        .json(new ApiResponse(200, updatedTweet, "Tweet updated successfully!"))
});

// delete tweet
const deleteTweet = asyncHandler(async (req, res) => {
    const { tweetId } = req.params;

    if (!mongoose.Types.ObjectId.isValid(tweetId)) {
        throw new ApiError(400, "Tweet id invalid")
    }

    const tweet = await Tweet.findById(tweetId);

    if (!tweet) {
        throw new ApiError(400, "Tweet not found!")
    }

    if (tweet.owner.toString() !== req.user._id.toString()) {
        throw new ApiError(404, "You can only delete your own tweets!")
    }

    await tweet.deleteOne()

    return res
        .status(200)
        .json(new ApiResponse(200, { deletedTweet: tweet }, "Tweet Deleted!"))
})


export {
    postTweet,
    updateTweet,
    deleteTweet
}
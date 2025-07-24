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
});

// get all tweets
const getAllTweets = asyncHandler(async (req, res) => {
    const { page = 1, limit = 10 } = req.params;

    const skip = (parseInt(page) - 1) * parseInt(limit);

    const tweets = await Tweet.find()
        .populate("owner", "username")
        .sort({ createdAt: -1 })
        .skip(skip)
        .limit(parseInt(limit))

    const totalTweets = await Tweet.countDocuments();

    return res
        .status(200)
        .json(new ApiResponse(200, { totalTweets, page: parseInt(page), limit: parseInt(limit), tweets }, "Tweets fetched successfully!"))

});

// get user tweets
const getUserTweets = asyncHandler(async (req, res) => {
    const { userId } = req.params;
    const { page = 1, limit = 10 } = req.params;
    const skip = (parseInt(page) - 1) * parseInt(limit);

    const tweets = await Tweet.find()
        .populate("owner", "username")
        .sort({ createdAt: -1 })
        .skip(skip)
        .limit(parseInt(limit))

    const totalTweets = await Tweet.countDocuments({ owner: userId });

    return res
        .status(200)
        .json(new ApiResponse(200,
            {
                totalTweets,
                page,
                limit,
                tweets
            }, "All tweets fetched successfully!"))
})


export {
    postTweet,
    updateTweet,
    deleteTweet,
    getAllTweets,
    getUserTweets
}
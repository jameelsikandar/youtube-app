import mongoose from "mongoose";
import { Tweet } from '../models/tweet.model.js';
import { ApiError } from "../utils/ApiError.js";
import { ApiResponse } from "../utils/ApiResponse.js";
import { asyncHandler } from "../utils/asyncHandler.js";


const addTweet = asyncHandler(async (req, res) => {
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


export { addTweet }
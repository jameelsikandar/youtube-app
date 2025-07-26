import mongoose from "mongoose";
import { Playlist } from '../models/playlist.model.js'
import { ApiError } from "../utils/ApiError.js";
import { ApiResponse } from "../utils/ApiResponse.js";
import { asyncHandler } from "../utils/asyncHandler.js";



const createPlaylist = asyncHandler(async (req, res) => {
    const { title, descripition } = req.body;
    const userId = req.user._id;

    if (!title) {
        throw new ApiError(400, "Title is required!")
    }

    const playlist = await Playlist.create({
        title,
        descripition,
        owner: userId,
        videos: []
    });

    return res
        .status(200)
        .json(
            new ApiResponse(201, playlist, "Playlist created successfully!")
        )
});

export { createPlaylist }

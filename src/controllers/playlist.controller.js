import mongoose from "mongoose";
import { Playlist } from '../models/playlist.model.js'
import { ApiError } from "../utils/ApiError.js";
import { ApiResponse } from "../utils/ApiResponse.js";
import { asyncHandler } from "../utils/asyncHandler.js";


// create playlist
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

//  update playlist
const updatePlaylist = asyncHandler(async (req, res) => {
    const { title, descripition } = req.body;
    const { playlistId } = req.params;

    if (!title) {
        throw new ApiError(400, "Title is required!")
    }

    if (!mongoose.Types.ObjectId.isValid(playlistId)) {
        throw new ApiError(400, "Playlist id is invalid")
    }

    const playlist = await Playlist.findById(playlistId)

    if (!playlist) {
        throw new ApiError(400, "Playlist not found!")
    }

    if (playlist.owner.toString() !== req.user._id.toString()) {
        throw new ApiError(400, "You can only update your own playlists!")
    }


    playlist.title = title;
    playlist.descripition = descripition;

    const updatedPlaylist = await playlist.save()


    return res
        .status(200)
        .json(new ApiResponse(200, updatedPlaylist, "Playlist Updated successfully!"))
});

// add videos to playlist
const addVideosToPlaylist = asyncHandler(async (req, res) => {
    const { playlistId, videoId } = req.params;

    if (!(mongoose.Types.ObjectId.isValid(playlistId) && mongoose.Types.ObjectId.isValid(videoId))) {
        throw new ApiError(400, "Plasylist id or video id is invalid!")
    }

    const playlist = await Playlist.findById(playlistId)

    if (!playlist) {
        throw new ApiError(400, "Playlist not found")
    }

    if (playlist.videos.includes(videoId)) {
        throw new ApiError(400, "Video already exists in playlist!")
    }

    playlist.videos.push(videoId)

    const addedVideo = await playlist.save();

    return res
        .status(200)
        .json(new ApiResponse(200, addedVideo, "Video added successfully!"))

})




export {
    createPlaylist,
    updatePlaylist,
    addVideosToPlaylist
}

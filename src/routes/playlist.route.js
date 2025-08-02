import express, { Router } from 'express';
import {
    createPlaylist,
    updatePlaylist,
    addVideosToPlaylist,
    getUserPlaylist,
    getPlaylistById,
    removeVideoFromPlaylist,
    deletePlaylist
} from '../controllers/playlist.controller.js';
import { verifyJWT } from '../middlewares/auth.middleware.js'

const router = Router();


// create playlist
router.route('/create-playlist').post(verifyJWT, createPlaylist);

// update playlsit
router.route('/update-playlist/:playlistId').post(verifyJWT, updatePlaylist);

// add video to playlist
router.route('/add-video/:playlistId/:videoId').post(verifyJWT, addVideosToPlaylist);

// get all user playlists
router.route('/user-playlists/:userId').get(verifyJWT, getUserPlaylist);

// get playlist by id
router.route("/:playlistId").get(getPlaylistById);

//remove video from playlist
router.route("/remove-video/:playlistId/:videoId").delete(removeVideoFromPlaylist);

// delete playlist
router.route("/delete/:playlistId").delete(verifyJWT, deletePlaylist);

export default router;
import express, { Router } from 'express';
import {
    createPlaylist,
    updatePlaylist,
    addVideosToPlaylist,
    getUserPlaylist
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

export default router;
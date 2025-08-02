import express, { Router } from 'express'
import { getChannelStats, getChannelVideos } from '../controllers/dashboard.controller.js'
import { verifyJWT } from '../middlewares/auth.middleware.js'


const router = Router();


// get channel stats
router.route("/stats/:channelId").get(verifyJWT, getChannelStats);

// get channel videos
router.route("/videos/:channelId").get(verifyJWT, getChannelVideos);



export default router;
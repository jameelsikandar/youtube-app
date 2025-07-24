import express, { Router } from 'express'
import { verifyJWT } from '../middlewares/auth.middleware.js'
import { toggleVideoLike, toggleCommentLike, toggleTweetLike } from '../controllers/like.controller.js'


const router = Router();



// toggle video like
router.route('/video/:videoId').post(verifyJWT, toggleVideoLike);

// toggle tweet like
router.route('/tweet/:tweetId').post(verifyJWT, toggleTweetLike);

// toggle comment like
router.route('/comment/:commentId').post(verifyJWT, toggleCommentLike);

export default router;

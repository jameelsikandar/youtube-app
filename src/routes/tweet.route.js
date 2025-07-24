import express, { Router } from 'express'
import { verifyJWT } from '../middlewares/auth.middleware.js'
import {
    postTweet,
    updateTweet
} from '../controllers/tweet.controller.js'

const router = Router();


// post tweet
router.route('/post-tweet').post(verifyJWT, postTweet);

// update tweet
router.route('/update-tweet/:tweetId').patch(verifyJWT, updateTweet);






export default router;
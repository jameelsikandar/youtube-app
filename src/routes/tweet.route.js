import express, { Router } from 'express'
import { verifyJWT } from '../middlewares/auth.middleware.js'
import {
    postTweet,
    updateTweet,
    deleteTweet,
    getAllTweets,
    getUserTweets
} from '../controllers/tweet.controller.js'

const router = Router();


// post tweet
router.route('/post-tweet').post(verifyJWT, postTweet);

// update tweet
router.route('/update-tweet/:tweetId').patch(verifyJWT, updateTweet);

//delte tweet
router.route('/delete-tweet/:tweetId').delete(verifyJWT, deleteTweet);

// get all tweets
router.route('/').get(verifyJWT, getAllTweets);

// get all tweets made by user
router.route('/my-tweets/:userId').get(verifyJWT, getUserTweets);






export default router;
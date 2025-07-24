import express, { Router } from 'express'
import { verifyJWT } from '../middlewares/auth.middleware.js'
import { postTweet } from '../controllers/tweet.controller.js'

const router = Router();


// post tweet
router.route('/post-tweet').post(verifyJWT, postTweet)






export default router;
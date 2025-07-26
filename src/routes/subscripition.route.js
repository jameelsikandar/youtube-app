import express, { Router } from 'express';
import { verifyJWT } from '../middlewares/auth.middleware.js';
import { toggleChannelSubscribe, getUserChannelSubscribers, getChannelUserSubscribed } from '../controllers/subscripition.controller.js'


const router = Router();


// toggle subscripition
router.route('/:channelId').post(verifyJWT, toggleChannelSubscribe);

// return subscribers
router.route('/subscribers/:channelId').get(verifyJWT, getUserChannelSubscribers);

// return subscribed channels
router.route('/subscribed/:subscriberId').get(verifyJWT, getChannelUserSubscribed)



export default router;
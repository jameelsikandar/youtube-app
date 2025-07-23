import express, { Router } from 'express';
import { verifyJWT } from '../middlewares/auth.middleware.js'
import { addComment, deleteComment } from '../controllers/comment.controller.js'


const router = Router();


// add comment on a video
router.route('/:videoId').post(verifyJWT, addComment);

// delete comment
router.route('/:commentId').delete(verifyJWT, deleteComment);



export default router;
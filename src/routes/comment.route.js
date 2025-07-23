import express, { Router } from 'express';
import { verifyJWT } from '../middlewares/auth.middleware.js'
import { addComment, deleteComment, updateComment } from '../controllers/comment.controller.js'


const router = Router();


// add comment on a video
router.route('/:videoId').post(verifyJWT, addComment);

// delete comment
router.route('/:commentId').delete(verifyJWT, deleteComment);

// update comment
router.route('/:commentId').patch(verifyJWT, updateComment);



export default router;
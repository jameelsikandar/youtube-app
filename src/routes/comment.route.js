import express, { Router } from 'express';
import { verifyJWT } from '../middlewares/auth.middleware.js'
import { addComment, deleteComment, updateComment, getVideoComments } from '../controllers/comment.controller.js'


const router = Router();


// add comment on a video
router.route('/:videoId').post(verifyJWT, addComment);

// delete comment
router.route('/:commentId').delete(verifyJWT, deleteComment);

// update comment
router.route('/:commentId').patch(verifyJWT, updateComment);

// get all comments on a video
router.route('/all-comments/:videoId').get(verifyJWT, getVideoComments)



export default router;
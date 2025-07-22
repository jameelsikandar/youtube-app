import express from 'express'
import { publishAvideo, getVideoById, updateVideoDetails, togglePublishStatus, deleteVideo } from '../controllers/video.controller.js'
import { upload } from '../middlewares/multer.middleware.js'
import { verifyJWT } from '../middlewares/auth.middleware.js'


const router = express.Router();


router.route('/').post(verifyJWT, upload.fields(
    [
        { name: "videoFile", maxCount: 1 },
        { name: "thumbnail", maxCount: 1 }
    ]),
    publishAvideo
);

// get video by id
router.route('/:videoId').get(verifyJWT, getVideoById);

// update video details
router.route('/update/:videoId').patch(verifyJWT, updateVideoDetails);

// toggle publish status
router.route('/toggle-publish/:videoId').patch(verifyJWT, togglePublishStatus);

// delete a video
router.route('/delete/:videoId').delete(verifyJWT, deleteVideo);



export default router;
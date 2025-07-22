import express from 'express'
import { publishAvideo } from '../controllers/video.controller.js'
import { upload } from '../middlewares/multer.middleware.js'
import { verifyJWT } from '../middlewares/auth.middleware.js'


const router = express.Router();


router.route('/').post(verifyJWT, upload.fields(
    [
        { name: "videoFile", maxCount: 1 },
        { name: "thumbnail", maxCount: 1 }
    ]),
    publishAvideo
)



export default router;
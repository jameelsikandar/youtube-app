import { Router } from "express";
import { registerUser, loginUser, logoutUser, refreshAccessToken } from "../controllers/user.controller.js";
import { upload } from '../middlewares/multer.middleware.js'
import { verifyJWT } from "../middlewares/auth.middleware.js";


const router = Router();

// register user
router.route('/register').post(
    upload.fields(
        [
            {
                name: "avatar",
                maxCount: 1
            },
            {
                name: "coverImage",
                maxCount: 1
            }
        ]
    ),
    registerUser
);

// login user
router.route('/login').post(loginUser);

// secured routes
// logout user
router.route('/logout').post(verifyJWT, logoutUser);

router.route('/refresh-token').post(refreshAccessToken)


export default router; 
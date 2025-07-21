import { Router } from "express";
import {
    registerUser,
    loginUser,
    logoutUser,
    refreshAccessToken,
    changeUserPassword,
    getCurrentUser,
    updateAccountDetails,
    updateUserAvatar,
    updateCoverImage,
    getUserChannelProfile,
    getUserWatchHistory
} from "../controllers/user.controller.js";
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

// refesh token
router.route('/refresh-token').post(refreshAccessToken)

// change user password
router.route('/change-password').post(verifyJWT, changeUserPassword);

// get current user
router.route('/current-user').get(verifyJWT, getCurrentUser);

// update account details
router.route('/update-account-details').patch(verifyJWT, updateAccountDetails);

// update avatar
router.route('/update-avatar').patch(verifyJWT, upload.single("avatar"), updateUserAvatar);

// update cover image
router.route('/update-cover-image').patch(verifyJWT, upload.single("coverImage"), updateCoverImage);

// get channel profile details
router.route('/c/:username').get(verifyJWT, getUserChannelProfile);

// get user  watch history
router.route('/watch-history').get(verifyJWT, getUserWatchHistory);


export default router; 
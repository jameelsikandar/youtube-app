import { asyncHandler } from '../utils/asyncHandler.js'
import { ApiError } from '../utils/ApiError.js'
import validator from 'validator';
import { User } from '../models/user.model.js' // this --User-- directly interact with DB
import { uploadOnCloudinary } from '../utils/cloudinary.js'
import { ApiResponse } from '../utils/ApiResponse.js';
import jwt from 'jsonwebtoken';



// generate access and refresh token

const generateAccessAndRefreshToken = async (userId) => {
    try {
        const user = await User.findById(userId);
        const accessToken = user.generateAccessToken();
        const refreshToken = user.generateRefreshToken();

        user.refreshToken = refreshToken;
        await user.save({ validateBeforeSave: false });

        return { accessToken, refreshToken };

    } catch (error) {
        throw new ApiError(500, "Something went wrong while generating access or refresh token");
    }
};


// register user on our app

const registerUser = asyncHandler(async (req, res) => {
    // 1. get user details from frontend
    // 2. validation of user details
    // 3. check if user already exists (check via email - username)
    // 4. check for images fields ( avatar, images)
    // 5. upload on cloudinary (avatar, coverimage)
    // 6. create user object - create user in db
    // 7. remove password and refresh token field from response
    // 8. check for user creation
    // 9. return response
    // --------------------------------------- 

    // 1.
    const { username, fullName, email, password } = req.body;

    // console.log(req.body);

    // 2.
    if (
        [username, fullName, email, password]
            .some((field) => field?.trim() === "")
    ) {
        throw new ApiError(400, "All fields are required!")
    }

    if (!validator.isEmail(email.trim())) {
        throw new ApiError(400, "Please enter valid email!")
    }

    // 3. check if user already exists in our DB

    const userExists = await User.findOne({
        $or: [{ username }, { email }]
    })

    if (userExists) {
        throw new ApiError(409, "User already exists!")
    }

    // 4.

    const avatarLocalPath = req.files?.avatar[0]?.path;
    // const coverImageLocalPath = req.files?.coverImage[0]?.path;
    let coverImageLocalPath;

    if (req.files && Array.isArray(req.files.coverImage) && req.files.coverImage.length > 0) {
        coverImageLocalPath = req.files.coverImage[0].path;
    }

    // console.log(req.files);


    if (!avatarLocalPath) {
        throw new ApiError(400, "Avatar is missing!")
    }

    // 5.

    const avatar = await uploadOnCloudinary(avatarLocalPath);
    const coverImage = await uploadOnCloudinary(coverImageLocalPath);

    if (!avatar) {
        throw new ApiError(400, "Avatar is missing")
    }

    // 6.

    const user = await User.create(
        {
            fullName,
            email,
            avatar: avatar.url,
            coverImage: coverImage?.url || "",
            password,
            username: username.toLowerCase()
        }
    )

    // 7. 8.  check if user has be created or not in DB removed password and refreshToken

    const createdUser = await User.findById(user._id).select("-password -refreshToken");

    // console.log(createdUser);


    if (!createdUser) {
        throw new ApiError(500, "Something went wrong while registering new user")
    }

    //9.

    return res.status(201).json(
        new ApiResponse(200, createdUser, "User registered successfully!")
    )

});

// login user on our app

const loginUser = asyncHandler(async (req, res) => {
    // 1. req body -> data
    // 2. username or email
    // 3. find the user in DB
    // 4. password check
    // 5. generate access and refersh token
    // 6. send cookies

    // 1.

    const { email, username, password } = req.body;

    if (!(username || email)) {
        throw new ApiError(400, "Username or email is required")
    };

    // 2.
    const user = await User.findOne({
        $or: [{ username }, { email }]
    });

    // 3.
    if (!user) {
        throw new ApiError(404, "User does not exists!")
    };

    // 4.

    const isPasswordValid = await user.isPasswordCorrect(password)

    if (!isPasswordValid) {
        throw new ApiError(401, "Invalid user credentials!")
    }

    // 5.

    const { accessToken, refreshToken } = await generateAccessAndRefreshToken(user._id);

    // 6.

    const loggedInUser = await User.findById(user._id)
        .select("-password -refreshToken");

    const options = {
        httpOnly: true,
        secure: false,
    }

    res.status(200)
        .cookie("accessToken", accessToken, options)
        .cookie("refreshToken", refreshToken, options)
        .json(
            new ApiResponse(
                200,
                {
                    user: loggedInUser, accessToken, refreshToken
                },
                "User logged in successfully!"
            )
        )
});


// logout user from app

const logoutUser = asyncHandler(async (req, res) => {
    await User.findByIdAndUpdate(
        req.user._id,
        {
            $set: {
                refreshToken: undefined
            }
        }
    );

    const options = {
        httpOnly: true,
        secure: false
    }

    return res.status(200)
        .clearCookie("accessToken", options)
        .clearCookie("refreshToken", options)
        .json(new ApiResponse(200, {}, "User logout successfully!"))
});


// refresh access token

const refreshAccessToken = asyncHandler(async (req, res) => {
    const incomingRefreshToken = req.cookies.refreshToken || req.body.refreshToken;

    if (!incomingRefreshToken) {
        new ApiError(400, "Unauthorizied request")
    }

    try {
        const decodedToken = jwt.verify(
            incomingRefreshToken, process.env.REFRESH_TOKEN_SECRET
        )

        const user = await User.findById(decodedToken?._id)

        if (!user) {
            throw new ApiError(401, "Invalid refresh token")
        }

        if (incomingRefreshToken !== user?.refreshToken) {
            throw new ApiError(401, "Refresh token is expired or used")
        }

        const options = {
            httpOnly: true,
            secure: false
        }

        const { accessToken, newrefreshToken } = await generateAccessAndRefreshToken(user._id)

        return res
            .status(200).
            cookie("accessToken", accessToken, options).
            cookie("refreshToken", newrefreshToken, options)
            .json(new ApiResponse(200, { accessToken, refreshToken: newrefreshToken }, "Access token refrshed successfully"))
    } catch (error) {
        throw new ApiError(401, error?.message || "Invalid refresh token")
    }
});


// change user password

const changeUserPassword = asyncHandler(async (req, res) => {
    const { oldPassword, newPassword } = req.body

    const user = await User.findById(req.user?._id);

    const isPasswordCorrect = await user.isPasswordCorrect(oldPassword);

    if (!isPasswordCorrect) {
        throw new ApiError(400, "Invalid old password!")
    }

    user.password = newPassword
    await user.save({ validateBeforeSave: false })

    return res
        .status(200)
        .json(new ApiResponse(200, {}, "Password changed successfully!"))
});


// get current user details

const getCurrentUser = asyncHandler(async (req, res) => {
    return res
        .status(200)
        .json(new ApiResponse(200, req.user, "Current user fetched successfully!"))
});


// update account details

const updateAccountDetails = asyncHandler(async (req, res) => {
    const { fullName, email } = req.body;

    if (!(fullName || email)) {
        throw new ApiError(401, "Fullname or email is required!")
    }

    const user = await User.findByIdAndUpdate(
        req.user?._id,
        {
            $set: {
                fullName,
                email
            }
        },
        { new: true }
    ).select("-password -refreshToken");

    return res
        .status(200)
        .json(new ApiResponse(200, user, "Details updated successfully"));
});


// update user avatar

const updateUserAvatar = asyncHandler(async (req, res) => {
    const avatarLocalPath = req.file?.path;

    if (!avatarLocalPath) {
        throw new ApiError(400, "Avatar file is missing")
    };

    const avatar = await uploadOnCloudinary(avatarLocalPath);

    if (!avatar.url) {
        throw new ApiError(400, "Error while uploading avatar")
    }

    const user = await User.findByIdAndUpdate(
        req.user?._id,
        {
            $set: {
                avatar: avatar.url
            }
        },
        {
            new: true
        }
    ).select("-password -refreshToken");


    return res
        .status(200)
        .json(
            new ApiResponse(200, user, "Avatar Updated Successfully!")
        )
});


// update user cover image

const updateCoverImage = asyncHandler(async (req, res) => {
    const coverImgPath = req.file?.path;

    if (!coverImgPath) {
        throw new ApiError(400, "Cover image is required!")
    }

    const coverImg = await uploadOnCloudinary(coverImgPath);

    if (!coverImg) {
        throw new ApiError(400, "Error while uploading cover image!")
    }

    const user = await User.findByIdAndUpdate(
        req.user?._id,
        {
            $set: {
                coverImage: coverImg.url
            }
        },
        {
            new: true
        }
    ).select("-password -refreshToken");


    return res
        .status(200)
        .json(new ApiResponse(
            200, user, "Cover image updated successfully!"
        ));

});


export {
    registerUser,
    loginUser,
    logoutUser,
    refreshAccessToken,
    changeUserPassword,
    getCurrentUser,
    updateAccountDetails,
    updateUserAvatar,
    updateCoverImage
}
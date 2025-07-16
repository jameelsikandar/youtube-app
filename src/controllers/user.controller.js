import { asyncHandler } from '../utils/asyncHandler.js'
import { ApiError } from '../utils/ApiError.js'
import validator from 'validator';
import { User } from '../models/user.model.js' // this directly interact with DB
import { uploadOnCloudinary } from '../utils/cloudinary.js'
import { ApiResponse } from '../utils/ApiResponse.js';


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

    console.log(req.body);

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
    const coverImageLocalPath = req.files?.coverImage[0]?.path;

    console.log(req.files);


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

    console.log(createdUser);


    if (!createdUser) {
        throw new ApiError(500, "Something went wrong while registering new user")
    }

    //9.

    return res.status(201).json(
        new ApiResponse(200, createdUser, "User registered successfully!")
    )

});


export { registerUser }
import { asyncHandler } from "../utils/asyncHandler.js";
import { ApiError } from "../utils/apiError.js";
import { user } from "../models/user.model.js";
import { uploadOnCloudinary } from "../utils/cloudinary.js";
import { ApiResponse } from "../utils/ApiResponse.js";

const generateAccessAndRefreshTokens = async(userId) => {
    try{
        const user = await UserActivation.findById(userId)
        //Generating Both Tokes
        const accessToken = user.generateAccessToken()
        const refreshToken = user.generateRefreshToken()

        //Adding in DB => Adding in User Object
        user.refreshToken = refreshToken
        await user.save({validateBeforeSave: false})

        return {accessToken, refreshToken}

        }catch (error){
        throw new ApiError(500 , "Something went wrong while generating refresh and access token")
    }
}

const registerUser = asyncHandler(async (req, res) => {
    const { fullName, email, username, password } = req.body;
    console.log("email:", email);

    if (
        [fullName, email, username, password].some((field) => !field || field.trim() === "")
    ) {
        throw new ApiError(400, "All Fields are required");
    }

    // This uses the imported 'user' model, which is correct.
    const existedUser = await user.findOne({
        $or: [{ username }, { email }],
    });

    if (existedUser) {
        throw new ApiError(409, "User with email or username already exists");
    }


    const avatarLocalPath = req.files?.avatar[0]?.path;
    //'?' this is optional chaining operator it means try thr next step only if the first one gives valid result i.e. if in req.files no picture is uploaded then we will get an undefined error.

    // const coverImageLocalPath = req.files?.coverImage?.[0]?.path;

    //using the classic if-else technique

    let coverImageLocalPath;
    //1. Condition check (does req.files exist)
    //2. Our code expects the cover file to be an Array so it checks that if it is an array of length greater than 0.

    if(req.files && Array.isArray(req.files.
    coverImage) && req.files.coverImage.length > 0){
        coverImageLocalPath = req.files.coverImage[0].path
    }

    if (!avatarLocalPath) {
        throw new ApiError(400, "Avatar file is required");
    }

    const avatar = await uploadOnCloudinary(avatarLocalPath);
    const coverImage = await uploadOnCloudinary(coverImageLocalPath);

    if (!avatar) {
        throw new ApiError(400, "Avatar file is required but failed to upload");
    }

    // FIX 1: Rename the new variable to 'newUser'
    // This also uses the imported 'user' model's .create() method.
    const newUser = await user.create({
        fullName,
        avatar: avatar.url,
        coverImage: coverImage?.url || "",
        email,
        password,
        username: username.toLowerCase(),
    });

    // FIX 2: Use the new variable 'newUser' to get the ID
    const createdUser = await user.findById(newUser._id).select(
        "-password -refreshToken"
    );

    if (!createdUser) {
        throw new ApiError(500, "Something went wrong while registering a user");
    }

    return res.status(201).json(
        new ApiResponse(200, createdUser, "User Registered Successfully!!")
    );
});

const loginUser = asyncHandler(async (req,res) => {
    //Todos
    //1. Bring data from req.body
    //2. find the user
    //3. Password check
    //4. Generate access and refresh token
    //5. Send access and refresh tokens in secure cookies.

    const {email,username, password} = req.body
    if(!username || !email){
        throw new ApiError(400, "Username or Password is required ")
    }
    //Finding the User on the basis of username or email
    //$or or other keywords are used for DB Queries and findOne is used to find the first field in the DB with the field in the parenthesis

    const user = await UserActivation.findOne({
        $or: [{username},{email}]
    })

    if(!user){
        throw new ApiError(404, "User does not exist")
    }
    //User is the variable of mongoose but your variable is that of user.
    const isPasswordValid = await user.isPasswordCorrect(password)

    if(!isPasswordValid){
        throw new ApiError(401, "Invalid user Credentials")
    }
    //Generating access and refresh tokens and storing them as an object.
    const {acccessToken, refreshToken} = await generateAccessAndRefreshTokens(user._id)

    //Getting the values of the logged in user and storing it in loggedInUser
    const loggedInUser = await UserActivation.findById(user._id).select("-password -refreshToken ")

    //Sending as cookie
    const options = {
        httpOnly: true, // Without httpOnly the cookie can be modified by frontend as well but by httpOnly it doesn't
        secure: true
    }
    return res.status(200).cookie("accessToken",accessToken,options)
    .cookie("refreshToken", refreshToken, options)//sending response as cookie
    .json(//Sending response as json
        new ApiResponse(
            200,
            {
                user: loggedInUser, accessToken, 
                refreshToken
            },
            "User logged in Successfully"
        )

    )
})
const logoutUser = asyncHandler(async(req,res) => {
    // Clear Cookies and Access and Refresh Tokens
    // Problem-> How can we find the user when we cannot take email Id / password from the user as we do not have to make the user to fill the form.
    // We have to design a middleware to implement it.
    UserActivation.findbyIdAndUpdate(
        req.user._id,
        {   //Clearing AccessToken from DB
            $set: {
                refreshToken: undefined
            }
        },
            {
                new: true
            }
    )

    const options = {
        httpOnly: true,
        secure: true
    }
    
    return res
    .status(200)
    .clearCookie("accessToken", options)
    .clearCookie("refreshToken", options)
    .json(new ApiResponse(200, {}, "User logged Out Successfully"))
} )

export { registerUser,
        loginUser,
        logoutUser
 };
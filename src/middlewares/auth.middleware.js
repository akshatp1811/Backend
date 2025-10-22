//Verifies if the user is present or not?

import { ApiError } from "../utils/apiError.js";
import { asyncHandler } from "../utils/asyncHandler.js";
import jwt from "jsonwebtoken"
export const verifyJWT = asyncHandler(async(req, res, 
    next) => {
        try {
            const token = req.cookies?.accessToken || (req.header("Authorization") && req.header("Authorization").replace("Bearer ", ""));

            // const token = req.cookies?.accessToken || req.header("Authorization")?replace("Bearer ", "")
            //We use "?" because it is possible that the access token is not in cookie but in header
            //In Header we send it as Authorization: Bearer <token>
    
            if(!token){
                throw new ApiErrorpiError(401,"Unauthorized request");
            }
            jwt.verify(token, process.env.ACCESS_TOKEN_SECRET)
    
            await User.findById(decodedToken?._id).select("-password -refreshToken")
    
            if(!user){
                //next_video: Discuss about frontend
                throw new ApiError(401, "Invalid Access Token")
            }
    
            //After the middleware is implemented give ACCESS to the User.
            req.user = user;
            next()
        } catch (error) {
            throw new ApiError(401, error?.message || "Invalid access token")
        }
        
       
    })
//If the login is true i.e. it has accessToken and RefreshToken then add an object request.user in the the req.body
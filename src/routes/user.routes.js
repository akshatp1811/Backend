import { Router } from "express";
import { loginUser, logoutUser, refreshAccessToken, registerUser } from "../controllers/user.controller.js";
import { upload } from "../middlewares/multer.middleware.js"; // <-- 1. Don't forget to import upload
import { verifyJWT } from "../middlewares/auth.middleware.js";

const router = Router();

// 2. Chain the middleware and controller in ONE definition
router.route("/register").post(
    upload.fields([
        {
            name: "avatar",
            maxCount: 1
        },
        {
            name: "coverImage",
            maxCount: 1
        }
    ]),
    registerUser // The controller comes after the middleware
);

router.route("/login").post(loginUser)
router.route("/refresh-token").post(refreshAccessToken)

//Secured routes             v--middleware and then next()
// router.route("/logout").post(verifyJWT, logoutUser)
router.route("/logout").post(verifyJWT,  logoutUser)
export default router;
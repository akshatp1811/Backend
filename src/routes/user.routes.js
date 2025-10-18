import { Router } from "express";
import { registerUser } from "../controllers/user.controller.js";
import { upload } from "../middlewares/multer.middleware.js"; // <-- 1. Don't forget to import upload

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


export default router;















// import { Router } from "express";
// import { registerUser } from "../controllers/user.controller.js";
// const router = Router()

// router.route("/register").post(
//     upload.fields([
//         {
//             name: "avatar",
//             maxCount: 1
//         },
//         {
//             name:"coverImage",
//             maxCount: 1
//         }
//     ]
// )
// )

// router.route("/register").post(registerUser)

// export default router
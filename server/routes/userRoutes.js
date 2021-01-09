import express from "express"
const router = express.Router()

import {
    authUser,
    registerUser
} from "../controllers/userController.js"
import { protect } from "../middleware/authMiddleware.js";

router.route("/register").post(registerUser).get(protect);
router.post('/login', authUser)

export default router
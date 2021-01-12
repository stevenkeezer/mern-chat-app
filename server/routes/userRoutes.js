const express = require("express")
const router = express.Router()

const {
    authUser,
    registerUser
} = require("../controllers/userController")
const { protect } = require("../middleware/authMiddleware")

router.route("/register").post(registerUser).get(protect);
router.post('/login', authUser)

module.exports = router
const express = require("express")
const router = express.Router()

const {
    authUser,
    registerUser,
    getUserList,
    logout
} = require("../controllers/userController")
const { protect } = require("../middleware/authMiddleware")

router.route("/register").post(registerUser).get(protect);
router.post('/login', authUser)
router.route('/userlist').get(getUserList)
router.post('/logout', logout)


module.exports = router
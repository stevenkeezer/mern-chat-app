const express = require("express")
const router = express.Router()

const {
    authUser,
    registerUser,
    getUserList,
    logout,
    verifyAuthorization
} = require("../controllers/userController")
const { protect } = require("../middleware/authMiddleware")

router.route("/").post(registerUser).get(protect, getUserList);
router.route('/authorized').post(verifyAuthorization)
router.post('/login', authUser)
router.post('/logout', logout)


module.exports = router
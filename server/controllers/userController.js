const asyncHandler = require("express-async-handler")
const User = require("../models/userModel")
const generateToken = require("../utils/generateToken")
const validateRegisterInput = require("../validation/register")


// @desc Auth user & get token
// @route POST /api/users/login
// @acess Public
const authUser = asyncHandler(async (req, res) => {
    const { email, password } = req.body

    const user = await User.findOne({ email })

    if (user && (await user.matchPassword(password))) {
        res.json({
            _id: user.id,
            token: generateToken(user._id)
        })
    } else {
        res.status(401)
        throw new Error("Invalid email or password")
    }
})

// @desc   Regist a new user
// @route   POST /api/users/register
// @access   Public
const registerUser = asyncHandler(async (req, res) => {
    const { errors, isValid } = validateRegisterInput(req.body)

    if (!isValid) return console.log(res.status(404).json(errors))

    const { username, email, password } = req.body;

    const userNameExists = await User.findOne({ username });
    const userEmailExists = await User.findOne({ email });

    if (userNameExists) {
        res.status(400);
        throw new Error("Username already exists");
    }

    if (userEmailExists) {
        res.status(400);
        throw new Error("Email already exists");
    }

    const user = await User.create({
        username,
        email,
        password,
    });

    if (user) {
        res.status(201).json({
            _id: user._id,
            token: generateToken(user._id),
        });
    } else {
        res.status(400);
        throw new Error("Invalid user data");
    }
});



module.exports = { authUser, registerUser }
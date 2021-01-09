import asyncHandler from "express-async-handler"
import User from "../models/userModel.js"
import generateToken from "../utils/generateToken.js"
import validateRegisterInput from "../validation/register.js";


// @desc Auth user & get token
// @route POST /api/users/login
// @acess Public
const authUser = asyncHandler(async (req, res) => {
    const { email, password } = req.body

    const user = await User.findOne({ email })

    if (user && (await user.matchPassword(password))) {
        res.json({
            _id: user.id,
            username: user.username,
            email: user.email,
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
            username: user.username,
            email: user.email,
            token: generateToken(user._id),
        });
    } else {
        res.status(400);
        throw new Error("Invalid user data");
    }
});



export {
    authUser,
    registerUser
}
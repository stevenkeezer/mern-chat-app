
const asyncHandler = require("express-async-handler")
const User = require("../models/userModel")
const generateToken = require("../utils/generateToken")
const validateRegisterInput = require("../validation/register")
const verifyToken = require("../utils/verifyToken")

const onlineUsers = {};

// @desc determine is token is valid
// @route POST /api/users/authorization
// @acess Public
const verifyAuthorization = asyncHandler(async (req, res) => {
    const { token } = req.body
    const verified = verifyToken(token)

    onlineUsers[verified.id] = true
    req.io.sockets.emit("onlineUsers", onlineUsers);

    if (verified) {
        res.json({
            verified: true
        })
    }
})

// @desc get list of users
// @route POST /api/users/userlist
// @acess Private
const getUserList = asyncHandler(async (req, res) => {
    const id = req.user._id

    User.aggregate()
        .match({ _id: { $not: { $eq: id } } })
        .project({
            password: 0,
            __v: 0,
            date: 0,
        })
        .exec((err, users) => {
            if (err) {
                console.log(err);
                res.setHeader("Content-Type", "application/json");
                res.end(JSON.stringify({ message: "Failure" }));
                res.sendStatus(500);
            } else {
                res.send(users)
            }
        });
})

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

// @desc   Register a new user
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
        req.io.sockets.emit("newUser", user);

        onlineUsers[user.id] = true
        res.status(201).json({
            _id: user._id,
            token: generateToken(user._id),
        });
    } else {
        res.status(400);
        throw new Error("Invalid user data");
    }
});

// @desc   Logout a new user
// @route   POST /api/users/logout
// @access   Public
const logout = asyncHandler(async (req, res) => {
    const { currentUserId } = req.body
    delete onlineUsers[currentUserId]
    req.io.sockets.emit("onlineUsers", onlineUsers);
    res.json({})
})

module.exports = { authUser, registerUser, verifyAuthorization, getUserList, logout }
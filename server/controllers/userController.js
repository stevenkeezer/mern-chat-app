const jwt = require("jsonwebtoken");
const mongoose = require("mongoose");
const asyncHandler = require("express-async-handler")
const User = require("../models/userModel")
const generateToken = require("../utils/generateToken")
const validateRegisterInput = require("../validation/register")

const onlineUsers = {};

// @desc get list of users
// @route POST /api/users/userlist
// @acess Private
const getUserList = asyncHandler(async (req, res) => {
    try {
        let jwtUser = jwt.verify(req.headers.authorization, process.env.JWT_SECRET);
        let id = mongoose.Types.ObjectId(jwtUser.id);

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
                    req.io.sockets.emit("onlineUsers", onlineUsers);
                }
            });
    } catch (err) {
        console.log(err);
        res.setHeader("Content-Type", "application/json");
        res.end(JSON.stringify({ message: "Unauthorized" }));
        res.sendStatus(401);
    }
})

// @desc Auth user & get token
// @route POST /api/users/login
// @acess Public
const authUser = asyncHandler(async (req, res) => {
    const { email, password } = req.body

    const user = await User.findOne({ email })

    if (user && (await user.matchPassword(password))) {
        onlineUsers[user.id] = true

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
        req.io.sockets.emit("users", user.username);

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
    onlineUsers[currentUserId] = false
    req.io.sockets.emit("onlineUsers", onlineUsers);
    res.json({})
})

module.exports = { authUser, registerUser, getUserList, logout }
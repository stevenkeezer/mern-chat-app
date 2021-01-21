
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
    const verified = verifyToken(req.headers.authorization)

    onlineUsers[verified.id] = true
    req.io.sockets.emit("onlineUsers", onlineUsers);

    const currentUserId = verified.id
    const user = await User.find({ _id: currentUserId })

    if (verified) {
        res.send(user)
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
            token: "Bearer " + generateToken(user._id),
            name: user.name,
            username: user.username,
            userId: user._id,
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
            token: "Bearer " + generateToken(user._id),
            name: user.name,
            username: user.username,
            userId: user._id,
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

// @desc   Search for a user
// @route   POST /api/users/search
// @access   Private
const searchUser = asyncHandler(async (req, res) => {
    const queryString = req.body.query
    const searchResult = await User.find({ username: { $regex: String(queryString) } })

    if (!searchResult || searchResult.length === 0) res.status(400).send({ error: "No task was found" })
    res.status(200).send(searchResult)
})


module.exports = { authUser, registerUser, verifyAuthorization, getUserList, searchUser, logout, onlineUsers }
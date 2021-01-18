const express = require("express");
const dotenv = require("dotenv");
const connectDB = require("./config/db");
const { notFound, errorHandler } = require("./middleware/errorMiddleware");
const path = require("path");
const messages = require("./routes/messagesRoutes");

const userRoutes = require("./routes/userRoutes")

dotenv.config();

connectDB();

const app = express();

// Port that the webserver listens to
const PORT = process.env.PORT || 5000;

const server = app.listen(
    PORT,
    console.log(
        `Server running in ${process.env.NODE_ENV} mode on port ${PORT}`
    )
);

const io = require("socket.io")(server);

app.use(express.json())

const users = {};

io.on('connection', function (socket) {
    socket.on('login', function (data) {
        // saving userId to object with socket ID
        users[socket.id] = data.userId;
        return users
    });

    socket.on('disconnect', function () {
        // remove saved socket from users object
        delete users[socket.id];
    });
});

// Assign socket object to every request
app.use(function (req, res, next) {
    req.io = io;
    req.online = users
    next();
});

app.use('/api/users', userRoutes)
app.use("/api/messages", messages);

app.use(notFound)
app.use(errorHandler)


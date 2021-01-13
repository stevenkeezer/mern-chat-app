const express = require("express");
const dotenv = require("dotenv");
const connectDB = require("./config/db");
const { notFound, errorHandler } = require("./middleware/errorMiddleware");
const path = require("path");

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

// Assign socket object to every request
app.use(function (req, res, next) {
    req.io = io;
    next();
});

app.use('/api/users', userRoutes)

app.use(notFound)
app.use(errorHandler)


const express = require("express");
const dotenv = require("dotenv");
const connectDB = require("./config/db");
const { notFound, errorHandler } = require("./middleware/errorMiddleware");
const path = require("path");
const cors = require("cors")

const userRoutes = require("./routes/userRoutes")

dotenv.config();

connectDB();

const app = express();

// const __dirname = path.resolve();
// app.use(express.static(path.join(__dirname, "public")))

app.use(cors());

app.use(express.json())

app.use('/api/users', userRoutes)

app.use(notFound)
app.use(errorHandler)

const PORT = process.env.PORT || 5000;

app.listen(
    PORT,
    console.log(
        `Server running in ${process.env.NODE_ENV} mode on port ${PORT}`
    )
);


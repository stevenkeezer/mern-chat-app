import express from "express";
import dotenv from "dotenv";
import connectDB from "./config/db.js";
import { join } from "path";
import morgan from "morgan";

dotenv.config();

connectDB();

const app = express();

const PORT = process.env.PORT || 5000;


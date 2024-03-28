import express from "express"
import mongoose from "mongoose"
import dotenv from "dotenv"
import cors from "cors"
import cookieParser from "cookie-parser"
import corsConfig from "./Config/corsConfig.js"

dotenv.config()
import {UserRouter} from "./routes/user.js"
import db from "./db.js"

const app = express()
app.use(cors(corsConfig))
app.use(express.json())
app.use(cookieParser())

// routes
app.use('/auth', UserRouter)

//db connction
db();

const PORT = process.env.PORT || 3000;
app.listen(PORT, () => {
  console.log(`Server is running on port ${PORT}`);
});

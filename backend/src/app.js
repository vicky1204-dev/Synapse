import express, { urlencoded } from "express"
import cors from "cors"
import helmet from "helmet"
import { errorHandler } from "./middlewares/error.middleware.js"
import cookieParser from "cookie-parser";

const app = express()

app.use(helmet())
app.use(cors({
    origin: (origin, callback)=>{
        const allowedOrigins = process.env.CORS_ORIGIN.split(",");
        if(!origin || !allowedOrigins.includes(origin)){
            callback(null, true)
        } else {
        callback(new Error("Not allowed by CORS"));
      }
    },
    allowedHeaders: ["Content-Type", "Authorization", "Accept-Version"],
    methods: ["GET", "POST", "PUT", "DELETE"],
    credentials: true // you cant use * as origin if credentials are true
}))
app.use(express.json({limit: "16kb"}))
app.use(express.urlencoded({extended: true, limit: "16kb"}))
app.use(cookieParser())


import authRouter from "./modules/auth/auth.route.js"
app.use("/api/auth", authRouter)


app.use(errorHandler)

export default app
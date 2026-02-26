import express, { urlencoded } from "express"
import cors from "cors"
import helmet from "helmet"
import { errorHandler } from "./middlewares/error.middleware"

const app = express()

app.use(helmet())
app.use(cors())
app.use(express.json())
app.use(express.urlencoded())
app.use(errorHandler)

export default app
import { PORT, DB_URL } from "./config"
import express from "express"
import mongoose from "mongoose"
import cookieParser from "cookie-parser"
import {getRoutes, postRoutes, protectedRoutes} from "./routes"
import { authenticate } from "./middlewares"


const app = express()

app.use(cookieParser())
app.use(express.json())
app.use('/api', getRoutes)
app.use('/api', postRoutes)
app.use('/api', authenticate, protectedRoutes)

app.listen(PORT, () => console.log(`Server listening on http://localhost:${PORT}/api/`) )

mongoose.connect(DB_URL)
.then( ( ) => console.log('Database Connected!'))
.catch( err => console.log(err) )
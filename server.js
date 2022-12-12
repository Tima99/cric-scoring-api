import { PORT, DB_URL } from "./config"
import express from "express"
import mongoose from "mongoose"
import cookieParser from "cookie-parser"
import cors from "cors"
import {getRoutes, postRoutes, protectedRoutes} from "./routes"
import { authenticate } from "./middlewares"
import http from "http"
import socket from "./sockets"

const app = express()
const server = http.createServer(app)

const corsOptions = {
    origin : "http://localhost:3000",
    credentials : true
}

app.use(cors(corsOptions))
app.use(express.json())
app.use(cookieParser())
app.use('/api', getRoutes)
app.use('/api', postRoutes)
app.use('/api', authenticate, protectedRoutes)

server.listen(PORT, () => console.log(`🌍 Server listening on http://localhost:${PORT}/api/`) )
socket.listen(server, () => console.log(`🔌 Socket Connected!`))

mongoose.connect(DB_URL)
.then( ( ) => console.log('🌳 Database Connected!'))
.catch( err => console.log(err) )
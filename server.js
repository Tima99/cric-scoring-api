import { PORT, DB_URL } from "./config/index.js"
import express from "express"
import mongoose from "mongoose"
import cookieParser from "cookie-parser"
import cors from "cors"
import {getRoutes, postRoutes, protectedRoutes} from "./routes/index.js"
import { authenticate } from "./middlewares/index.js"
import http from "http"
import socket, {socketConnect} from "./sockets.js"

const app = express()
const server = http.createServer(app)

const corsOptions = {
    origin : ['https://cric-scoring.netlify.app', "http://localhost:3000"],
    credentials : true
}

app.use(cors(corsOptions))
app.use(express.json())
app.use(cookieParser())
app.use('/api', getRoutes)
app.use('/api', postRoutes)
app.use('/api', authenticate, protectedRoutes)

app.listen(PORT, () => console.log(`🌍 Server listening on http://localhost:${PORT}/api/`) )
const io = socket.listen(server, () => console.log(`🔌 Socket Connected!`))
io.on("connection", (socket) => {
    console.log(`⚡: ${socket.id} user just connected! ${io.engine.clientsCount}`);
    socket.on("disconnect", () => {
        socket.removeAllListeners()
        console.log("🔥: A user disconnected "+ io.engine.clientsCount );
    });
})

mongoose.connect(DB_URL)
.then( ( ) => console.log('🌳 Database Connected!'))
.catch( err => console.log(err) )
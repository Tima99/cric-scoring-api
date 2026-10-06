import { PORT, DB_URL, DOMAIN } from "./config/index.js"
import express from "express"
import mongoose from "mongoose"
import cookieParser from "cookie-parser"
import cors from "cors"
import {getRoutes, postRoutes, protectedRoutes} from "./routes/index.js"
import { authenticate } from "./middlewares/index.js"
import socket, {io} from "./sockets.js"

const app = express()

const corsOptions = {
    origin: [
        "https://cric-scoring.netlify.app",
        "https://cric-scoring.code26.site",
        //"http://localhost:3000"
    ],
    credentials: true
};

app.use((req, res, next) => {
    console.log("METHOD:", req.method);
    console.log("URL:", req.originalUrl);
    console.log("ORIGIN:", req.headers.origin);
    console.log("ACCESS-CONTROL-REQUEST-METHOD:", req.headers["access-control-request-method"]);
    console.log("ACCESS-CONTROL-REQUEST-HEADERS:", req.headers["access-control-request-headers"]);

    next();
});

app.use(cors(corsOptions));


app.use(express.json())
app.use(cookieParser())
app.use('/api', getRoutes)
app.use('/api', postRoutes)
app.use('/api', authenticate, protectedRoutes)

const server = app.listen(PORT, () => console.log(`🌍 Server listening on ${DOMAIN}`) )
socket.listen(server, () => console.log(`🔌 Socket Connected!`))

mongoose.connect(DB_URL)
.then( ( ) => console.log('🌳 Database Connected!'))
.catch( err => console.log(err) )

// routes for developers
app.get('/', (req, res) => res.send("Server Started 😍😍"))
app.get('/live-scoring-users', (req, res)=>{
    const users = io.engine.clientsCount
    res.send({users})
})
app.get('/*', (req, res)=> res.send("Not valid route."))

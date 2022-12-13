import { socketConnect } from "../../sockets.js"

export async function userAuthentic(req, res){
    socketConnect(req.email)
    res.send(req.email)
}
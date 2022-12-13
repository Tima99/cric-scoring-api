import { socketConnect as connectedSocketUser, io} from "../sockets.js"

export function socketConnect(req, res, next){
    const {matchId} = req.params 
    connectedSocketUser(matchId)
    req.io = io
    next()
}

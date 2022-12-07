import { ErrorHandler } from "../../utils"
import {Player} from "../../models"

export async function playerAuthentic(req, res){
    try {
        const playerDoc = await Player.findOne({email: req.email})
        if( !playerDoc ) return res.status(400).send(null)

        res.send(playerDoc)

    } catch (error) {
        console.log(error)
        if(error instanceof ErrorHandler)
            return res.status(error.code).send(error.message)
        res.status(500).send("Try after sometime.")
    }
}
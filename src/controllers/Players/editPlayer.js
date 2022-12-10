import { Player } from "../../models"
import { ErrorHandler } from "../../utils"

export async function editPlayer(req, res){
    try {
        const email = req.email

        const {name, location, role, gender} = req.body
        
        const playerDoc = await Player.findOneAndUpdate(
            {email},
            {
                $set:{
                    name,
                    location,
                    role,
                    gender
                }
            },
            {returnDocument: 'after'}
        )
            
        res.send(playerDoc)
        
    } catch (error) {
        console.log(error)
        if(error instanceof ErrorHandler)
            return res.status(error.code).send(error.message)
        res.status(500).send("Try after sometime.")
    }
}
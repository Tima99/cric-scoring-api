import { Player } from "../../models/index.js"

export async function leftTeam(req, res){
    try {
        const {teamId, playerId} = req.body
        const playerIdSelf = req.email

        const playerDoc = await Player.findOne({email: playerId || playerIdSelf})
        if(!playerDoc) throw new ErrorHandler({message: "Player not found!", code: 500})

        playerDoc.teams = playerDoc.teams.filter(team => team.toString() !== teamId )
        
        await playerDoc.save()
        
        res.send({message: "Removed sucessfull",...playerDoc.toObject()})
        
    } catch (error) {
        console.log(error);
        if( error instanceof ErrorHandler)
            return res.status(error.code).send(error.message)
        res.status(500).send('Try after sometime')
    }
}
import { Team } from "../../models"
import { ErrorHandler } from "../../utils"

export async function removePlayer(req, res, next){
    try {
        // req.body has object {teamId , playerId} 
        // use teamId here to check creator or captain
        // playerId use in laftTeam controller to remove player from team
        const {teamId} = req.body
        const authUser = req.email

        const team = await Team.findOne({_id : teamId}) 
        if(!team) throw new ErrorHandler({message: "Team not found!", code: 500})

        if(team.creator !== authUser && team.captain !== authUser) throw new ErrorHandler({message: "Admin or captain can remove player", code: 500})
        
        next()
        
    } catch (error) {
        console.log(error);
        if( error instanceof ErrorHandler)
            return res.status(error.code).send(error.message)
        res.status(500).send('Try after sometime')
    }
}
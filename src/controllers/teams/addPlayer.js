import mongoose from "mongoose";
import { Player, Team } from "../../models";
import { ErrorHandler } from "../../utils";

export async function addPlayer(req, res){
    try {
        // playerId is player's email
        // teamId is team's ObjectId
        const {teamId, playerId, role} = req.body

        // find player and check it already not added to this team
        const addingPlayer = await Player.findOne({email: playerId})
        if( !addingPlayer ) throw new ErrorHandler({message: "Player not found.", code: 500})
        // player already added
        const isAdded = addingPlayer.teams.findIndex(team_Id => team_Id.toString() === teamId)
        if(isAdded > -1) throw new ErrorHandler({message: "Player already added.", code: 500})

        // add player else
        const player = {_id : playerId, role}

        if( !mongoose.isValidObjectId(teamId) ) throw new ErrorHandler({message: "Wrong Team Id.", code: 500})

        const team = await Team.findById({ _id : mongoose.Types.ObjectId(teamId) })
        if( team === null ) throw new ErrorHandler({message: "Team not found.", code: 500})
        // check team has player or not
        const playerAdded = team.players.findIndex( player => player._id === playerId ) 
        if(playerAdded < 0)
            team.players.push(player)
            
        const updatedTeam = await team.save()

        // add team id to player doc
        addingPlayer.teams.push( mongoose.Types.ObjectId(teamId) )
        await addingPlayer.save()
        
        res.send(updatedTeam)

    } catch (error) {
        console.log(error);
        if(error instanceof ErrorHandler)
            return res.status(error.code).send(error.message)

        res.status(500).send("Try after sometime")
    }
}
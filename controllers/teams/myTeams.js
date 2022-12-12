import { Player, Team } from "../../models/index.js"
import { findAllById } from "../../utils/index.js"

export async function myTeams(req, res){
    try {
        const playerId = req.email

        const player = await Player.findOne({email: playerId})

        if(!player) return res.status(400).send({message: "Player not found."})

        const playerTeamsId = [...player.teams, ...player.teamsCreator]
        
        const teams = await findAllById(Team, playerTeamsId)

        res.send(teams)
        
    } catch (error) {
        console.log(error)
        res.status(500).send('Try after sometime')
    }
}
import mongoose from "mongoose";
import { Player, Team } from "../../models";

export async function deleteTeam(req, res) {
    try {
        const {teamId} = req.params
        const teamObjectId = mongoose.Types.ObjectId(teamId)
        const team = await Team.findById({ _id : teamObjectId})
        if(!team) return res.status(402).send("Team Not Found!")

        const teamPlayedNoMatches = team.matches.length <= 0

        if( !teamPlayedNoMatches ) return res.status(402).send("We are not able to delete this team.")

        const playersEmail = [...new Set([...team.players.map( ply => ply._id ), team.creator])]

        await Player.updateMany({email: {$in : playersEmail}}, {
            $pull:{
                teams: teamObjectId,
                teamsCreator: teamObjectId
            }
        })

        await Team.deleteOne({ _id : teamObjectId})

        res.send("deleted")
    } catch (error) {
        console.log(error);
        res.status(500).send("Try after sometime")
    }
}
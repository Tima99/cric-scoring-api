import { Team, Player } from "../../models/index.js"

export async function createTeam(req, res) {
    try {
        const { name, location, logo, admin, role } = req.body
        const creator = req.email
        const user_player = await Player.findOne({email : creator});
        
        if( !user_player ) return res.status(401).send("Player Not Found!")

        // if admin true
        // than team creator wants to add as player in that team
        let player = {
            _id: creator,
            role,
            name: user_player && user_player.name
        }
        if (!admin) player = null

        const teamDoc = Team({
            name,
            location,
            creator,
            creatorName: user_player.name,
            captain: admin ? creator : null,
            captainName: admin ? user_player.name : null,
            players : player ? [player] : []
        })

        const team = await teamDoc.save()

        // if player not added to team only create this tem 
        // than team Id added to their teamsCreator array
        // otherwise if he added as player than in teams array
        await Player.updateOne({ email: creator }, { $push: player ? { teams: team._id } : { teamsCreator: team._id } })

        res.send(team)

    } catch (error) {
        console.log(error)

        res.status(500).send("Try After sometime")
    }
}
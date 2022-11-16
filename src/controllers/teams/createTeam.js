import { Team, Player } from "../../models"

export async function createTeam(req, res) {
    try {
        const { name, location, logo, admin, role } = req.body
        const creator = req.email
        console.log(admin);

        // if admin true
        // than team creator wants to add as player in that team
        let player = {
            _id: creator,
            role,
        }
        if (!admin) player = null

        const teamDoc = Team({
            name,
            location,
            creator,
            admin: admin ? creator : null,
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
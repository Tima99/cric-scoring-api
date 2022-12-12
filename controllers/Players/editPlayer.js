import { Player, Team } from "../../models"
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
            
        // also update name in its team document
        const teamsId = [...playerDoc.teams]

        // change name in players array
        await Team.updateMany(
            { _id: {$in : teamsId}},
            {
                $set:{
                    "players.$[i].name" : name,
                }
            },
            {arrayFilters: [{"i._id" : playerDoc.email}]}
        )
        // change name of captain if its me otherwise don't change 
        await Team.updateMany(
            { _id: {$in : teamsId}, captain: playerDoc.email},
            {
                $set:{
                    captainName : name,
                }
            },
        )

        // change creator name of teams whom i am admin/creator
        await Team.updateMany(
            { _id: {$in : [...playerDoc.teamsCreator, ...teamsId]}, creator: playerDoc.email},
            {
                $set:{
                    creatorName: name
                }
            },
        )
        
        res.send(playerDoc)
        
    } catch (error) {
        console.log(error)
        if(error instanceof ErrorHandler)
            return res.status(error.code).send(error.message)
        res.status(500).send("Try after sometime.")
    }
}
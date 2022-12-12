import { Player, Team, User } from "../models"
import { ErrorHandler } from "../utils"

export async function search(req, res) {
    try {
        const { query, searchFor } = req.query
        // console.log(query, searchFor);

        // return res.send("Work in Progress...")

        // remove / from string as its gives error in regex
        query.replaceAll('/', '')

        let search = null
        if (searchFor === "players")
            search = await Player.find({ name: { $regex: '^' + query, $options: 'i' } })
        else if (searchFor === "teams")
            search = await Team.find({ name: { $regex: '^' + query, $options: 'i' } })
        else{
            search = await Team.find({ name: { $regex: '^' + query, $options: 'i' } })
            search = { "teams" : search, "players" : await Player.find({ name: { $regex: '^' + query, $options: 'i' } }) }
        }
            
        res.send(search)
    } catch (error) {
        console.log(error);
        if (error instanceof ErrorHandler)
            return res.status(error.code).send(error.message)

        res.status(500).send('Try After Sometime')
    }
}
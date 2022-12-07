import {Match} from "../../models"
import { ErrorHandler } from "../../utils";

export async function myMatches(req, res){
    try {
        const email = req.email
        console.log(email);

        const matches = await Match.find()
        // console.log(matches);
        const myMatches = matches.filter( (match, i) => {
            let isMyTeam = match.teamA.players.findIndex( ply => ply._id == email)
            isMyTeam = isMyTeam < 0 && match.teamB.players.findIndex( ply => ply._id == email)
            return isMyTeam > -1
        })

        // console.log(myMatches);

        res.send(myMatches)

    } catch (error) {
        console.log(error);
        if (error instanceof ErrorHandler)
            return res.status(error.code).send(error.message);

        res.status(500).send("Try After Sometime");
    }
}
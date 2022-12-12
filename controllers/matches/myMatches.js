import {Match} from "../../models"
import { ErrorHandler } from "../../utils";

export async function getMyMatches(req, res, next, ){
    try {
        const email = req.email
        // console.log(email);

        const matches = await Match.find()
        // console.log(matches);
        const myMatches = matches.filter( (match, i) => {
            let isMyTeam = match.teamA.players.findIndex( ply => ply._id == email)
            isMyTeam = isMyTeam < 0 && match.teamB.players.findIndex( ply => ply._id == email)
            return isMyTeam > -1
        })

        // console.log(myMatches);
        req.myMatches = myMatches
        next()

    } catch (error) {
        console.log(error);
        if (error instanceof ErrorHandler)
            return res.status(error.code).send(error.message);

        res.status(500).send("Try After Sometime");
    }
}

export function sendMyMatches(req, res){
    const myMatches = req.myMatches
    res.send(myMatches)
}
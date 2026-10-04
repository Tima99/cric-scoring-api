import mongoose from "mongoose";
import { Match } from "../../models/index.js"
import { ErrorHandler } from "../../utils/index.js"

// Public version: anyone can view a match, but the scorer's email is never exposed
export async function getPublicMatch(req, res) {
    try {
        const {matchId} = req.params

        if(!mongoose.isValidObjectId(matchId)) throw new ErrorHandler({message: "Please provide valid match id.", code: 422})

        const match = await Match.findById(matchId).select("-scoringBy -__v")
        if(!match) throw new ErrorHandler({message: "Match not found.", code: 404})
        res.send(match)

    } catch (error) {
        if (error instanceof ErrorHandler)
            return res.status(error.code).send(error.message)

        console.log(error);
        res.status(500).send('Try After Sometime')
    }
}

export async function getMatch(req, res) {
    try {
        const {matchId} = req.params
        // console.log(matchId, req.params);

        if(!mongoose.isValidObjectId(matchId)) throw new ErrorHandler({message: "Please provide valid match id.", code: 422})
        
        const match = await Match.findById({_id : mongoose.Types.ObjectId(matchId)}) 
        res.send(match)

    } catch (error) {
        console.log(error);
        if (error instanceof ErrorHandler)
            return res.status(error.code).send(error.message)

        res.status(500).send('Try After Sometime')
    }
}
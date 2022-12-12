import mongoose from "mongoose";
import { Match } from "../../models/index.js"
import { ErrorHandler } from "../../utils/index.js"

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
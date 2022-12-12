import mongoose from "mongoose";
import { Match } from "../../models/index.js"

export async function getMatches(req, res){
    try {
        const matches = req.body
        const matchesObjectId = matches.map( id => mongoose.Types.ObjectId(id))

        const matchesDoc = await Match.find({ _id : {$in: matchesObjectId}})
        
        res.send(matchesDoc)
    } catch (error) {
        console.log(error);
        res.status(500).sedn('try after sometime!')
    }
}
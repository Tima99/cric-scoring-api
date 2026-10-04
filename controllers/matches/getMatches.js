import mongoose from "mongoose";
import { Match } from "../../models/index.js"

export async function getMatches(req, res){
    try {
        const matches = req.body
        const matchesObjectId = matches.map( id => mongoose.Types.ObjectId(id))

        const matchesDoc = await Match.find({ _id : {$in: matchesObjectId}}).select("-scoringBy -__v")
        
        res.send(matchesDoc)
    } catch (error) {
        console.log(error);
        res.status(500).send('try after sometime!')
    }
}

// Public listing of all matches (no login needed), newest first.
// GET /api/matches?status=live|completed&page=1&limit=20
export async function listMatches(req, res){
    try {
        const { status } = req.query
        const page  = Math.max(parseInt(req.query.page) || 1, 1)
        const limit = Math.min(Math.max(parseInt(req.query.limit) || 20, 1), 50)

        // winTeam is null (or a string containing "null") while the match is still being played
        const isLive = { $or: [{ winTeam: null }, { winTeam: /null/ }] }
        const filter =
            status === "live"      ? isLive :
            status === "completed" ? { $nor: isLive.$or } :
            {}

        const [matches, total] = await Promise.all([
            Match.find(filter)
                .select("-scoringBy -__v")
                .sort({ createdAt: -1 })
                .skip((page - 1) * limit)
                .limit(limit),
            Match.countDocuments(filter),
        ])

        res.send({ matches, page, limit, total, hasMore: page * limit < total })
    } catch (error) {
        console.log(error);
        res.status(500).send("Try after sometime!")
    }
}

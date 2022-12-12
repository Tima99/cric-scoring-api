import { Player } from "../../models/index.js"

export async function opponentsTeam(req, res){
    try {
        const email = req.email
        const myMatches = req.myMatches
        const playerDoc = await Player.findOne({email: req.email})

        if( myMatches.length === 0) return res.send([])
        
        const playerNotFound = (player) => player._id !== email

        const opponentsTeamId = []

        const opponentsTeam = myMatches.map( match => {
            const isExistA = opponentsTeamId.findIndex(teamId => (teamId === match.teamA._id) )
            const isExistB = opponentsTeamId.findIndex(teamId => (teamId === match.teamB._id) )
            if( isExistA === -1 && match.teamA.players && match.teamA.players.every(playerNotFound) ){
                opponentsTeamId.push(match.teamA._id)
                return match.teamA
            }
            else if( isExistB === -1 && match.teamB.players && match.teamB.players.every(playerNotFound) ){
                opponentsTeamId.push(match.teamB._id)
                return match.teamB
            }
            else
                return null
        }).filter( team => team !== null )

        // remove duplicates team and send
        
        res.send(Array.from(new Set([...opponentsTeam])))

    } catch (error) {
        console.log(error)
        res.status(500).send('Try after sometime')   
    }
}
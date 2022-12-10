import { Player } from "../../models"

export async function opponentsTeam(req, res){
    try {
        const email = req.email
        const myMatches = req.myMatches

        if( myMatches.length === 0) return res.send([])
        
        const playerNotFound = (player) => player._id !== email

        const opponentsTeam = myMatches.map( match => {
            if( match.teamA.players && match.teamA.players.every(playerNotFound) )
                return match.teamA
            else if( match.teamB.players && match.teamB.players.every(playerNotFound) )
                return match.teamB
            else
                return null
        }).filter( team => team !== null )


        res.send(opponentsTeam)

    } catch (error) {
        console.log(error)
        res.status(500).send('Try after sometime')   
    }
}
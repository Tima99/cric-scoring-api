import mongoose from "mongoose";
import { Match, Player, Team } from "../models";

export async function TeamWin(matchDoc) {
    try {
        const stats = matchDoc.stats;
        const totalInn = stats.length;
        if (totalInn < 2) return false;

        let winTeam = null;
        // winTeam has _id of any win team
        // winTeam has false indicates match tie
        // winTeam has null indicates match ongoing or result not come yet

        const inn1 = stats[totalInn - 1];
        const teamBat1st =
            (inn1.bat._id === matchDoc.teamA._id && matchDoc.teamA) ||
            (inn1.bat._id === matchDoc.teamB._id && matchDoc.teamB);

        const inn2 = stats[totalInn - 2];
        const teamBat2nd =
            (inn2.bat._id === matchDoc.teamA._id && matchDoc.teamA) ||
            (inn2.bat._id === matchDoc.teamB._id && matchDoc.teamB);

        const score1 = inn1.bat.score;
        const score2 = inn2.bat.score;

        const teamBat2ndTotalWickets =
            teamBat2nd.players.filter((player) => player.isSelected).length - 1;
        const teamBat2ndWicketsFall = inn2.bat.batters.filter(
            (batter) => batter && batter.out
        ).length;
        const teamBat2ndWicketsRemain =
            teamBat2ndTotalWickets - teamBat2ndWicketsFall;

        if (score2 > score1) winTeam = inn2.bat._id;
        else if (
            score2 === score1 &&
            (inn2.totalBalls >= matchDoc.overs * 6 ||
                teamBat2ndWicketsRemain <= 0)
        )
            winTeam = false;
        else if (teamBat2ndWicketsRemain <= 0 && score1 > score2)
            winTeam = inn1.bat._id;
        else if (inn2.totalBalls >= matchDoc.overs * 6) winTeam = inn1.bat._id;
        else winTeam = null;

        if (winTeam !== null) {
            const matchWin = await Match.findByIdAndUpdate(
                { _id: mongoose.Types.ObjectId(matchDoc._id) },
                { winTeam: winTeam, updatePlayers: true },
                { returnDocument: "after" }
            );
            // if match ended than perform
            // players stats updates and TeamStatsUpdate
            if( !matchDoc.updatePlayers ){
                await UpdateTeamStats(matchWin)
                await UpdatePlayerStats(matchDoc);
            }

            return matchWin;
        }
        return null;
    } catch (error) {
        return Promise.reject(error)
    }
}

async function UpdateTeamStats(matchDoc){
    try {
        if(matchDoc.winTeam === 'false'){
            await Team.updateMany({_id: {$in : [mongoose.Types.ObjectId(matchDoc.teamA._id), mongoose.Types.ObjectId(matchDoc.teamB._id)]}}, {
                $inc:{ "stats.tie" : 1}    
            })
        }
        else{
            const r = await Team.updateOne({_id: mongoose.Types.ObjectId(matchDoc.winTeam)}, {
                $inc:{ "stats.won" : 1}
            })
        }
    } catch (error) {
        return Promise.reject(error)
    }
}

async function UpdatePlayerStats(matchDoc) {
    try {
        const teamAPlayers = [ ...matchDoc.stats[0].bat.batters, ...matchDoc.stats[1].bowl.bowlers ];
        const teamBPlayers = [ ...matchDoc.stats[0].bowl.bowlers, ...matchDoc.stats[1].bat.batters ];
        const playersInTeamA = matchDoc.teamA.players.filter( (player) => player && player.isSelected );
        const playersInTeamB = matchDoc.teamB.players.filter( (player) => player && player.isSelected );

        playersInTeamA.forEach( updatePlayerMatch )
        playersInTeamB.forEach( updatePlayerMatch )

        teamAPlayers.forEach( updatePlayer );
        teamBPlayers.forEach( updatePlayer );
    } catch (error) {
        return Promise.reject(error)
    }
}

async function updatePlayerMatch(player){
    try {
        const email = player._id
        await Player.updateOne(
            {email},
            {
                $inc:
                {
                    "stats.matches": 1
                }
            }
        )
    } catch (error) {
        console.log(error)
    }
}

async function updatePlayer(player){
    try {
        if(!player) return
        const playerId = player._id;
        // differentiate between batter or bowler or both
        const diffrentiate  = player.ballsBowl === null || player.ballsBowl === undefined;
        const playerType    = diffrentiate ? "batting" : "bowling";
        
        let bowler = {
            dots: null,
        };
        if (playerType === "bowling") {
            bowler.dots  = (Array.isArray(player.spell) && player.spell.filter((ball) => ball == 0).length) || 0;
            bowler.fours = (Array.isArray(player.spell) && player.spell.filter((ball) => ball == 4).length) || 0;
            bowler.sixes = (Array.isArray(player.spell) && player.spell.filter((ball) => ball == 4).length) || 0;
            bowler.overs = Math.floor( !isNaN(player.ballsBowl) ? player.ballsBowl/ 6 : 0)
        }

        await Player.updateOne(
            { email: playerId },
            {
                $inc: {
                    [`stats.${playerType}.innings`]: 1 ,
                    [`stats.${playerType}.runs`]: player.runs || 0,
                    [`stats.${playerType}.fours`]: player.fours || bowler.fours || 0,
                    [`stats.${playerType}.sixes`]: player.sixes || bowler.sixes || 0,
                    [`stats.${playerType}.balls.total`]: player.balls || player.ballsBowl || 0,
                    [`stats.${playerType}.balls.dots`]: (player.runningRuns && player.runningRuns[0]) || bowler.dots || 0,
                    [`stats.${playerType}.wickets`]: player.wickets || 0,
                    [`stats.${playerType}.overs`]: bowler.overs || 0,
                    [`stats.${playerType}.notOut`]: playerType == "batting" ? (player.out ? 0 : 1) : 0,
                },
            }
        );

        if(playerType == "batting")
            await Player.updateOne(
                { email: playerId, "stats.batting.highest.score" : {$lt : player.runs} },
                {
                    $set:{
                        "stats.batting.highest.score" : player.runs,
                        "stats.batting.highest.isNotOut": player.out ? false : true
                    }
                }
            )
    } catch (error) {
        console.log(error);
    }
}

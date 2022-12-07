import mongoose from "mongoose";
import { Match } from "../models";

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
        else if (score2 === score1 && (inn2.totalBalls >= matchDoc.overs * 6 || teamBat2ndWicketsRemain <= 0)) winTeam = false;
        else if (teamBat2ndWicketsRemain <= 0 && score1 > score2) winTeam = inn1.bat._id;
        else if (inn2.totalBalls >= matchDoc.overs * 6) winTeam = inn1.bat._id;
        else winTeam = null;

        if (winTeam !== null) {
            const matchWin = await Match.findByIdAndUpdate(
                { _id: mongoose.Types.ObjectId(matchDoc._id) },
                { winTeam: winTeam },
                { returnDocument: "after" }
            );
            return matchWin;
        }
        return null;
    } catch (error) {}
}

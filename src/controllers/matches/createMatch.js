import { Match } from "../../models";
import { ErrorHandler } from "../../utils";
export async function createMatch(req, res) {
    try {
        const {
            teamA,
            teamB,
            toss,
            overs,
            oversPerBowler,
            venue,
            ballType,
            striker,
            nonStriker,
            bowler,
            scoringBy
        } = req.body;



        if (teamA._id === teamB._id)
            throw new ErrorHandler({
                message: "Both teams cannot be same.",
                code: 422,
            });

        
        const labels      = [teamA, teamB];
        const indx        = toss.won === teamA._id ? 0 : 1;
        let batFirstTeam  = labels[toss.select === "bat" ? indx : 1 - indx];
        let bowlFirstTeam = labels[toss.select === "bowl" ? indx : 1 - indx];

        const batInitialStats = {
            runs: 0,
            sixes: 0,
            fours: 0,
            runningRuns: [0, 0, 0],
            lb: 0,
            out: false,
        };
        const cb = (player) => {
            let ply = player.isSelected &&
                player._id === striker && {
                    ...player,
                    ...batInitialStats,
                    strike: true,
                    isSelected: undefined,
                };
            ply =
                ply ||
                (player.isSelected &&
                    player._id === nonStriker && {
                        ...player,
                        ...batInitialStats,
                        nonStriker: undefined,
                        wicketkeeper: undefined,
                        strike: false,
                        isSelected: undefined,
                    });
            ply =
                ply ||
                (player.isSelected &&
                    player._id === bowler && {
                        ...player,
                        strike: true,
                        isSelected: undefined,
                    });
            return ply;
        };

        const strikerTeamA = batFirstTeam.players.map(cb).filter((v) => v);
        const strikerTeamB = bowlFirstTeam.players.map(cb).filter((v) => v);
        
        const matchDoc = await Match({
            toss,
            venue,
            overs,
            oversPerBowler,
            ballType,
            teamA,
            teamB,
            scoringBy: scoringBy || req.email,
            stats: [ // 0 index indicates !st inning and 1 index indicates 2nd innings
                    {
                        bat: {
                            _id: batFirstTeam._id,
                            score: 0,
                            wide: 0,
                            nb: 0,
                            bye: 0,
                            name: batFirstTeam.name,
                            batters: strikerTeamA
                        },
                        bowl: {
                            _id: bowlFirstTeam._id,
                            name: bowlFirstTeam.name,
                            bowlers: strikerTeamB,
                        },
                    },
            ],
        });

        const matchCreated = await matchDoc.save();

        if(req.email === scoringBy || !scoringBy)
            res.send(matchCreated);
        else
            res.send({})
    } catch (error) {
        console.log(error);
        if (error instanceof ErrorHandler)
            return res.status(error.code).send(error.message);

        res.status(500).send("Try After Sometime");
    }
}

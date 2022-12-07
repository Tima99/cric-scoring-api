import mongoose from "mongoose";
import { Server } from "socket.io";
import { Match } from "./models";
export let io = null;
import { TeamWin } from "./utils";

const socket = {
    listen: (server, cb) => {
        io = new Server(server, {
            transports: ["websocket"],
            cors: { origin: "*" },
        });
        cb();
    },
};
let sockets = [];


export function socketConnect({ matchId }) {
    console.log("user connected! Runs");

    io.on("connection", (socket) => {
        socket.id = matchId;
        // if(sockets.findIndex(item => item == socket.id) < 0)
        //     sockets.push(socket.id);
        // else
        //     {
        //         console.log("🔥: A user disconnected");
        //         socket.disconnect();
        //     }

        console.log(`⚡: ${socket.id} user just connected! ${io.engine.clientsCount}`);
        socket.on("disconnect", () => {
            socket.removeAllListeners()
            console.log("🔥: A user disconnected "+ io.engine.clientsCount );
        });
        // socket.on("force-disconnect", () => {
        //     socket.disconnect();
        // });

        socket.on("add-unrunning-runs", async (runs) => {
            try {
                const labels = { 0: "dots", 4: "fours", 6: "sixes" };
                const selectedLabel = labels[runs];

                const matchDoc = await Match.findByIdAndUpdate(
                    { _id: mongoose.Types.ObjectId(socket.id) },
                    {
                        $push: {
                            "stats.0.bat.batters.$[o].runSpell": runs,
                            "stats.0.bowl.bowlers.$[b].spell": runs,
                        },
                        $inc: {
                            "stats.0.bat.batters.$[o].balls": 1,
                            [`stats.0.bat.batters.$[o].${selectedLabel}`]: 1,
                            "stats.0.totalBalls": 1,
                            "stats.0.bat.batters.$[o].runs": runs,
                            "stats.0.bat.score": runs,
                            "stats.0.bowl.bowlers.$[b].ballsBowl": 1,
                            "stats.0.bowl.bowlers.$[b].runs": runs,
                        },
                    },
                    {
                        arrayFilters: [
                            { "o.strike": true },
                            { "b.strike": true },
                        ],
                        returnDocument: "after",
                    }
                );
                const matchWinResult = await TeamWin(matchDoc)
                socket.emit("updated-document", matchWinResult || matchDoc);
            } catch (error) {
                console.log(error);
            }
        });

        socket.on("add-runs-ball", async ({ runs }) => {
            try {
                const increamentThings = {
                    $inc: {
                        "stats.0.bat.batters.$[o].runs": runs,
                        [`stats.0.bat.batters.$[o].runningRuns.${runs - 1}`]: 1,
                        "stats.0.bat.score": runs,
                        "stats.0.bat.batters.$[o].balls": 1,
                        "stats.0.totalBalls": 1,
                        "stats.0.bowl.bowlers.$[b].ballsBowl": 1,
                        "stats.0.bowl.bowlers.$[b].runs": runs,
                    },
                };
                const changeStrike = {
                    $set: {
                        "stats.0.bat.batters.$[i].strike": true,
                        "stats.0.bat.batters.$[o].strike": false,
                    },
                };
                const pushThings = {
                    $push: {
                        "stats.0.bat.batters.$[o].runSpell": runs,
                        "stats.0.bowl.bowlers.$[b].spell": runs,
                    },
                };
                let updatedMatchDoc = null;

                if (runs % 2)
                    updatedMatchDoc = await Match.findByIdAndUpdate(
                        { _id: mongoose.Types.ObjectId(socket.id) },
                        {
                            ...pushThings,
                            ...increamentThings,
                            ...changeStrike,
                        },
                        {
                            arrayFilters: [
                                { "o.strike": true },
                                { "i.strike": false },
                                { "b.strike": true },
                            ],
                            returnDocument: "after",
                        }
                    );
                // if batsman takes even runs strike not changed
                else
                    updatedMatchDoc = await Match.findByIdAndUpdate(
                        {
                            _id: mongoose.Types.ObjectId(socket.id),
                        },
                        {
                            ...pushThings,
                            ...increamentThings,
                        },
                        {
                            arrayFilters: [
                                { "o.strike": true },
                                { "b.strike": true },
                            ],
                            returnDocument: "after",
                        }
                    );
                        
                

                const matchWinResult = await TeamWin(updatedMatchDoc)
                
                socket.emit("updated-document", matchWinResult || updatedMatchDoc);
            } catch (error) {
                console.log(error);
            }
        });

        socket.on("next-bowler", async ({ nextBowler, currentBowler }) => {
            try {
                const setNextBowler = { ...nextBowler, strike: true };
                await Match.findOneAndUpdate(
                    { _id: mongoose.Types.ObjectId(socket.id), "stats.0.bowl.bowlers" : { $not : {$elemMatch: {_id : setNextBowler._id }} } },
                    {
                        $push: {
                            "stats.0.bowl.bowlers" : setNextBowler
                        }
                    }
                )
                
                const setThing = {
                    $set: {
                        "stats.0.bat.batters.$[i].strike": true,
                        "stats.0.bat.batters.$[o].strike": false,
                        "stats.0.bowl.bowlers.$[nb].strike": true,
                        "stats.0.bowl.bowlers.$[cb].strike": false,
                    },
                };
                // return console.log(setNextBowler, currentBowler)
                const matchDoc = await Match.findOneAndUpdate(
                    { _id: mongoose.Types.ObjectId(socket.id) },
                    {
                        ...setThing,
                    },
                    {
                        arrayFilters: [
                            { "cb._id": currentBowler._id },
                            { "nb._id": setNextBowler._id },
                            { "o.strike": true },
                            { "i.strike": false },
                        ],
                        returnDocument: "after",
                    }
                );
                socket.emit("updated-document", matchDoc);
            } catch (error) {
                console.log(error);
            }
        });

        socket.on("batsman-out", async (data) => {
            try {
                // console.log(data);
                const prefix = {
                    bowled: "b",
                    "caught behind": "wk",
                    stump: "stump",
                    "run out": "run out",
                    lbw: "lbw",
                    "caught out": "c",
                    "hit wicket": "hit wkt",
                    mankanding: "mankanding",
                };

                const fieldersStr = data.fielders.reduce(
                    (a, c) => (c ? a + c.name.slice(0, 1).toUpperCase() + c.name.slice(1) + "/" : a),
                    ""
                );
                let outStr = `${
                    (data.outType.toLowerCase() != "bowled"  &&
                    prefix[data.outType.toLowerCase()]) || ''
                } ${
                    fieldersStr && fieldersStr.slice(0, fieldersStr.length - 1) || ''
                } ${data.outType != "run out" ? `b ${data.bowler.name.slice(0, 1).toUpperCase() + data.bowler.name.slice(1)}`: ''}`;
                outStr = outStr.toString().trim()

                data.score.runs = new Number(data.score.runs) 
                const {noBall, wide} = data.score
                if(wide) ++data.score.runs

                const updatedMatchDoc = await Match.findByIdAndUpdate(
                    { _id: mongoose.Types.ObjectId(socket.id) },
                    {
                        $inc: {
                            "stats.0.bat.score": data.score.runs,
                            "stats.0.bat.batters.$[outBats].runs": data.score.runs,
                            "stats.0.bat.batters.$[outBats].balls":  !wide ? 1 : 0 ,
                            "stats.0.totalBalls": !wide ? 1 : 0,
                            "stats.0.bat.wickets": 1,
                            "stats.0.bowl.bowlers.$[strikeBowler].wickets": data.outType != "run out" ? 1 : 0,
                            "stats.0.bowl.bowlers.$[strikeBowler].ballsBowl": !wide ? 1 : 0,
                            "stats.0.bowl.bowlers.$[strikeBowler].runs": data.score.runs,
                        },
                        
                        $set: {
                            "stats.0.bat.batters.$[outBats].outType": data.outType,
                            "stats.0.bat.batters.$[outBats].fielders": data.fielders,
                            "stats.0.bat.batters.$[outBats].out": outStr,
                            "stats.0.bat.batters.$[strikeHave].strike": false
                        },
                        
                    },
                    {
                        arrayFilters: [{"outBats._id": data.outBatsman._id}, {"strikeBowler._id" : data.bowler._id}, {"strikeHave.strike": true}],
                        returnDocument: "after",
                    }
                );

                const addedNewBatsman = await Match.findByIdAndUpdate(
                    {_id : mongoose.Types.ObjectId(socket.id)},
                    {
                        $push: {
                            "stats.0.bowl.bowlers.$[strikeBowler].wicketTaken": data.outBatsman,
                            "stats.0.bowl.bowlers.$[strikeBowler].spell": 'W',
                            "stats.0.bat.batters": data.nextBatsman && {...data.nextBatsman, strike: true},
                        },
                    },
                    {
                        arrayFilters: [{"strikeBowler._id" : data.bowler._id}],
                        returnDocument: "after",
                    }
                    
                )

                const matchWinResult = await TeamWin(addedNewBatsman)

                socket.emit("updated-document", matchWinResult || addedNewBatsman)

            } catch (error) {
                console.log(error);
            }
        });

        socket.on("next-inning-start",({striker, nonStriker, bowler, batTeam, bowlTeam}) => {
            const nextInningAdded = Match.findById(
                {_id : mongoose.Types.ObjectId(socket.id)},
                async function (err, doc) {
                    try {
                        if(err){
                            throw Error({message: err, name: "next-inning-start socket-on"})
                        }
                        const nextInning = {
                            bat: {
                                _id : batTeam.id,
                                name: batTeam.name,
                                batters: [{...striker, strike: true}, {...nonStriker, strike: false}],
                                score: 0,
                            },
                            bowl: {
                                _id : bowlTeam.id,
                                name: bowlTeam.name,
                                bowlers: [{...bowler, strike: true}]
                            },
                            totalBalls: 0
                        }
                        doc.stats.unshift(nextInning)   
                        // console.log(doc.stats);
                        const isSave = await doc.save()
                        // console.log(isSave)
                        socket.emit("updated-document", isSave)
                    } catch (error) {
                        console.log(error)
                    }
                })
        })

        socket.on("change-strike", async() => {
            try {
                const changeStrike = {
                    $set: {
                        "stats.0.bat.batters.$[i].strike": true,
                        "stats.0.bat.batters.$[o].strike": false,
                    },
                }
    
                const changed = await Match.findByIdAndUpdate(
                    {_id : mongoose.Types.ObjectId(socket.id)},
                    {
                        ...changeStrike
                    },
                    {arrayFilters: [
                        { "o.strike": true },
                        { "i.strike": false },
                    ], returnDocument: 'after'}
                )
    
                socket.emit("updated-document", changed)
            } catch (error) {
                console.log(error);
            }
        })

        socket.on("wide", async() => {
            try {
                const matchDoc = await Match.findByIdAndUpdate(
                    {_id : mongoose.Types.ObjectId(socket.id)},
                    {
                        $inc:{
                            "stats.0.bat.wide": 1,
                            "stats.0.bat.score": 1,
                            "stats.0.bowl.bowlers.$[sb].runs": 1
                        },
                        $push: {
                            "stats.0.bowl.bowlers.$[sb].spell": 'wd'
                        }
                    },
                    {arrayFilters: [{'sb.strike': true}], returnDocument: 'after'}
                )
                const matchWinResult = await TeamWin(matchDoc)

                socket.emit("updated-document", matchWinResult || matchDoc)
            } catch (error) {
                console.log(error);
            }
        })

        
        socket.on("noBall", async(runs) => {
            try {
                // inc runs by 1 as its no ball
                runs = new Number(runs)
                const runsWithNoball = runs + 1

                const changeStrike = {
                    $set: {
                        "stats.0.bat.batters.$[i].strike": true,
                        "stats.0.bat.batters.$[o].strike": false,
                    },
                };

                let matchDoc = await Match.findByIdAndUpdate(
                    {_id : mongoose.Types.ObjectId(socket.id)},
                    {
                        $inc:{
                            "stats.0.bat.noBall": 1,
                            "stats.0.bat.score" : runsWithNoball,
                            "stats.0.bowl.bowlers.$[sb].runs": runsWithNoball,
                            "stats.0.bat.batters.$[sbat].runs": runs,
                            "stats.0.bat.batters.$[sbat].balls": 1,
                            
                        },
                        $push: {
                            "stats.0.bowl.bowlers.$[sb].spell": runs != 0 ? `nb+${runs}` : 'nb',
                            "stats.0.bat.batters.$[sbat].runSpell": runs,
                        }
                    },
                    {arrayFilters: [{'sb.strike': true}, {'sbat.strike': true}], returnDocument: 'after'}
                )

                if(runs % 2){
                    matchDoc = await Match.findByIdAndUpdate(
                        {_id : mongoose.Types.ObjectId(socket.id)},
                        {
                            ...changeStrike
                        },
                        {arrayFilters: [
                            { "o.strike": true },
                            { "i.strike": false },
                        ], returnDocument: 'after'}
                    )
                }

                
                const matchWinResult = await TeamWin(matchDoc)

                socket.emit("updated-document", matchWinResult || matchDoc)
            } catch (error) {
                console.log(error);
            }
        })

        socket.on("legBye", async(runs) => {
            try {
                runs = new Number(runs)

                const changeStrike = {
                    $set: {
                        "stats.0.bat.batters.$[i].strike": true,
                        "stats.0.bat.batters.$[o].strike": false,
                    },
                };

                let matchDoc = await Match.findByIdAndUpdate(
                    {_id : mongoose.Types.ObjectId(socket.id)},
                    {
                        $inc:{
                            "stats.0.bat.batters.$[sbat].lb": 1,
                            "stats.0.bat.batters.$[sbat].balls": 1,
                            "stats.0.bat.score" : runs,
                            "stats.0.bowl.bowlers.$[sbowl].runs": runs,
                            "stats.0.bowl.bowlers.$[sbowl].ballsBowl": 1,
                            "stats.0.totalBalls": 1,
                        },
                        $push: {
                            "stats.0.bowl.bowlers.$[sbowl].spell": `lb+${runs}`,
                            "stats.0.bat.batters.$[sbat].runSpell": `lb+${runs}`,
                        }
                    },
                    {arrayFilters: [{'sbowl.strike': true}, {'sbat.strike': true}], returnDocument: 'after'}
                )

                if(runs % 2){
                    matchDoc = await Match.findByIdAndUpdate(
                        {_id : mongoose.Types.ObjectId(socket.id)},
                        {
                            ...changeStrike
                        },
                        {arrayFilters: [
                            { "o.strike": true },
                            { "i.strike": false },
                        ], returnDocument: 'after'}
                    )
                }
                
                const matchWinResult = await TeamWin(matchDoc)

                socket.emit("updated-document", matchWinResult || matchDoc)
            } catch (error) {
                console.log(error);
            }
        })

        socket.on("bye", async(runs) => {
            try {
                runs = new Number(runs)

                const changeStrike = {
                    $set: {
                        "stats.0.bat.batters.$[i].strike": true,
                        "stats.0.bat.batters.$[o].strike": false,
                    },
                };
                let matchDoc = await Match.findByIdAndUpdate(
                    {_id : mongoose.Types.ObjectId(socket.id)},
                    {
                        $inc:{
                            "stats.0.bat.score" : runs,
                            "stats.0.bowl.bowlers.$[sbowl].ballsBowl": 1,
                            "stats.0.totalBalls": 1,
                            "stats.0.bye": runs,
                            "stats.0.bat.batters.$[sbat].balls": 1,
                        },
                        $push: {
                            "stats.0.bowl.bowlers.$[sbowl].spell": `bye+${runs}`,
                        }
                    },
                    {arrayFilters: [{'sbowl.strike': true}, {'sbat.strike': true}], returnDocument: 'after'}
                )

                if(runs % 2){
                    matchDoc = await Match.findByIdAndUpdate(
                        {_id : mongoose.Types.ObjectId(socket.id)},
                        {
                            ...changeStrike
                        },
                        {arrayFilters: [
                            { "o.strike": true },
                            { "i.strike": false },
                        ], returnDocument: 'after'}
                    )
                }

                const matchWinResult = await TeamWin(matchDoc)

                socket.emit("updated-document", matchWinResult || matchDoc)
                
            } catch (error) {
                console.log(error);
            }
        })

    });
}

export default socket;

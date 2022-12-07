import mongoose from "mongoose";

const { Schema } = mongoose

const playerSchema = new Schema({
    email: { type: String, require: true, unique: true },
    name: { type: String, require: true },
    location: {type : String},
    role: {type : String},
    gender: {type : String},
    verified: { type: Boolean },
    stats: {
        type: {
            matches: { type: Number , default: 0},
            batting: {
                innings: { type: Number },
                runs: { type: Number },
                sixes: { type: Number },
                fours: { type: Number },
                notOut: { type: Number },
                balls: { total: Number, dots: Number },
                highest: {score: {type: Number, default: 0}, isNotOut: Boolean}
            },
            bowling: {
                innings: { type: Number },
                wickets: { type: Number },
                runs: { type: Number },
                sixes: { type: Number },
                fours: { type: Number },
                overs: { type: Number },
                balls: { total: Number, dots: Number }
            }
        }
    },
    teams: { type: Array }, // contains ObjectId of team
    teamsCreator: {type: Array}, // this contain team's ObjectId only which player is not added but create team
    awards: { type: Object }
}, { timestamps: true })

const Player = mongoose.model('Player', playerSchema, "players")

export default Player
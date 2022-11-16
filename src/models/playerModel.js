import mongoose from "mongoose";

const { Schema } = mongoose

const playerSchema = new Schema({
    email: { type: String, require: true, unique: true },
    name: { type: String, require: true },
    verified: { type: Boolean },
    stats: {
        type: {
            matches: { type: String , default: 0},
            batting: {
                innings: { type: String },
                runs: { type: String },
                lbRuns: { type: String },
                sixes: { type: String },
                fours: { type: String },
                balls: { total: String, dots: String }
            },
            bowling: {
                innings: { type: String },
                wickets: { type: String },
                runs: { type: String },
                sixes: { type: String },
                fours: { type: String },
                overs: { type: String },
                balls: { total: String, dots: String }
            }
        }
    },
    teams: { type: Array },
    awards: { type: Object }
}, { timestamps: true })

const Player = mongoose.model('Player', playerSchema, "players")

export default Player
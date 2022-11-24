import mongoose from "mongoose"

const { Schema } = mongoose

const teamSchema = new Schema({
    creator: {type: String}, // contains email of creator
    name: { type: String, require: true },
    location: { type: String, require: true },
    logo: { type: String, require: true },
    admin: { type: String },
    captain: { type: String },
    captainName: {type: String},
    players: {
        type: [
            {
                _id: { type: String }, // player email
                role: { type: String },
                name: {type: String},
                stats: {
                    type: {
                        batting: {
                            type: Object
                        },
                        bowling: {
                            type: Object
                        }
                    }
                }
            }
        ]
    },
    matches: { type: Array }
}, { timestamps: true })

const Team = mongoose.model("Team", teamSchema, "teams")

export default Team
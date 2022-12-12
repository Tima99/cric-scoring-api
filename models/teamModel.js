import mongoose from "mongoose"

const { Schema } = mongoose

const teamSchema = new Schema({
    creator: {type: String}, // contains email of creator
    creatorName: {type: String}, // contains name of creator
    name: { type: String, require: true },
    location: { type: String, require: true },
    logo: { type: String, require: true },
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
    stats: {
        // matches: <you can get number of matches play using length of matches array>
        won: Number,
        tie: Number, // both score equal if match end
        draw: Number, // if one of the inn not completed in given time match will be drawn ( in test )
        // loss: matches - won - tie - draw
        tossWon: Number,
        batFirst: Number,
        // bowlFirst: tossWon - batFirst,
    },
    matches: { type: Array }
}, { timestamps: true })

const Team = mongoose.model("Team", teamSchema, "teams")

export default Team
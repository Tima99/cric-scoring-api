import mongoose from "mongoose";

const { Schema } = mongoose;

const matchSchema = new Schema(
    {
        overs: Number,
		oversPerBowler: Number,
        venue: String,
        extras: { wd: Number, nb: Number },
        toss: { won: String, select: String },
        ballType: { type: String },
		winTeam: {type: String, default: null},
		scoringBy: String,
        teamA: {
            _id: String,
            name: String,
            players: [{ _id: String, name: String, isSelected: Boolean }],
            captain: String,
            wicketkeeper: String, // array of wicketkeepers contain _id
        },
        teamB: {
            _id: String,
            name: String,
            players: [{ _id: String, name: String, isSelected: Boolean }],
            captain: String,
            wicketkeeper: String, // array of wicketkeepers contain _id
        },
        stats: Array,
    },
    { timestamps: true }
);

matchSchema.methods.updateDotBall = function () {
    this.stats.length;
    const totalInn = this.stats.length;
    const currentBatting =
        this.stats[totalInn - 1][`inning${totalInn}`].bat.batters;
    const bats_strike = currentBatting.findIndex((bats) => bats.strike);
	this.stats[totalInn - 1][`inning${totalInn}`].bat.batters[bats_strike].balls = 1
	this.stats[totalInn - 1][`inning${totalInn}`].bat.batters[bats_strike].dots = 1
};

const Match = mongoose.model("Match", matchSchema, "matches");

export default Match;

/* 
    {
	"teamA":{
		"_id": "637489703b96295e7e6819ea",
		"playing11":[
								{
                        "_id" : "amit208201@gmail.com",
												"name": "Amit"
                },
                {
                        "_id" : "ninja208201@gmail.com",
												"name": "Ayush"
                },
                {
                        "_id" : "amit208201@gmail.com",
												"name": "Shivam"
                }
		],
		"captain": "amit208201@gmail.com",
		"wicketkeeper": ["ninja208201@gmail.com"]
	},
	"teamB":{
		"_id" : "63789a33ebcdd49701e8b8c6",
		"playing11":[
							 {
                        "_id" : "ja208201@gmail.com",
                        "name" : "anupam"
                },
                {
                        "_id" : "a200@gmail.com",
                        "name" : "ankit"
                }
		],
		"captain": "ja208201@gmail.com",
		"wicketkeeper": ["a200@gmail.com"]
	},
	"toss": {"won" : "637489703b96295e7e6819ea", "select": "bat"},
	"venue": "Senior Ground",
	"overs": 15,
	"stats":[
		{
			"inning1": {
				"bat":{
					"team" : "637489703b96295e7e6819ea",
					"batters" : [
						{
							"player": "amit208201@gmail.com",
							"stats":{
								"runs": 0,
								"balls": 10,
								"sixes": 0,
								"fours": 0,
								"running-runs": [0, 0, 0],
								"lb": 0,
								"out": false,
								"bowlerToOut": "",
								"outType": null,
								"fielder": ""
							}
						}
					]
				},
				"bowl":{
					"team" : "63789a33ebcdd49701e8b8c6",
					"bowlers" : [
						{
							"player": "ja208201@gmail.com",
							"stats":{
								"wickets": 0,
								"spells":[[0,0]],
								"runs": 0,
								"balls": 10,
								"sixes": 0,
								"fours": 0,
								"running-runs": [0, 0, 0],
								"wide":0,
								"nb": 0
							}
						}
					]
				}
			}
		}
	]
}
*/

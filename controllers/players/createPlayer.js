import { Player, User } from "../../models/index.js"
import { validate } from "../../services/index.js"
import { ErrorHandler } from "../../utils/index.js"

export async function createPlayer(req, res){
    try {
        let email = req.email
        // if player is not a user 
        // if another player wants to create player (when add player to team)
        email = req.body.email || email
        const {name, location, role, gender} = req.body

        // validation
        if(! validate.email(email)) throw new ErrorHandler({message: "Email not correct", code: 422})
        if(! validate.name(name) ) throw new ErrorHandler({message: "Name must be min 3 and max 15", code: 422})

        // player already exists
        const playerExists = await Player.findOne({email})
        if( playerExists ) return res.status(403).send("player already exists")
        
        // if player email exists in users collection and otp Verified
        // than player is verified
        const user = await User.findOne({email})
        const isPlayerVerified = user && user.isVerified() ? true : false

        // create player
        const newPlayerDoc = await Player({email, name: name.trim(), verified: isPlayerVerified, location, role, gender})
        await newPlayerDoc.save()

        res.send(newPlayerDoc)

    } catch (error) {
        console.log(error)
        if(error instanceof ErrorHandler)
            return res.status(error.code).send(error.message)
        res.status(500).send("Try after sometime.")
    }
}
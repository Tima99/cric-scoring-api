import { Player, User } from "../../models"
import { validate } from "../../services"
import { ErrorHandler } from "../../utils"

export async function createPlayer(req, res){
    try {
        const {email, name} = req.body

        // validation
        if(! validate.email(email)) throw new ErrorHandler({message: "Email not correct", code: 422})
        if(! validate.name(name) ) throw new ErrorHandler({message: "Name must be min 3 and max 15", code: 422})

        // player already exists
        const playerExists = await Player.findOne({email})
        if( playerExists ) return res.status(200).send({message: "player already exists", ...playerExists.toObject() })
        
        // if player email exists in users collection and otp Verified
        // than player is verified
        const user = await User.findOne({email})
        const isPlayerVerified = user && user.isVerified() ? true : false

        // create player
        const newPlayerDoc = await Player({email, name, verified: isPlayerVerified})
        await newPlayerDoc.save()

        res.send(newPlayerDoc)

    } catch (error) {
        console.log(error)
        if(error instanceof ErrorHandler)
            return res.status(error.code).send(error.message)
        res.status(500).send("Try after sometime.")
    }
}
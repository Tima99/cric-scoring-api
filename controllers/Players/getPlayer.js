import mongoose from "mongoose";
import { Player } from "../../models";
import {validate} from "../../services"

export async function getPlayer(req , res){
    try {
        const {_id} = req.params
        let player = null
        if( mongoose.isValidObjectId(_id) ){
            player = await Player.findById({_id: mongoose.Types.ObjectId(_id)})
        }
        else if(validate.email(_id)){
            player = await Player.findOne({email: _id})
        }

        if(!player) return res.status(422).send("Player not Found!")

        res.send(player)
    } catch (error) {
        console.log(error);
        res.status(500).send("Try after sometime...")
    }
}
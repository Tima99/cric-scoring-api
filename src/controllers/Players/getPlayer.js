import mongoose from "mongoose";
import { Player } from "../../models";

export async function getPlayer(req , res){
    try {
        const {_id} = req.params
        
        const player = await Player.findById({_id: mongoose.Types.ObjectId(_id)})
        if(!player) return res.status(401).send("Player not Found!")

        res.send(player)
    } catch (error) {
        console.log(error);
        res.status(500).send("Try after sometime...")
    }
}
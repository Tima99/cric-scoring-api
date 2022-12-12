import mongoose from "mongoose";
import {Team} from "../../models"
import { ErrorHandler } from "../../utils";
export const getTeam = async (req, res) => {
    try {
        const {id} = req.params
        /// console.log(id);
        if( !mongoose.isValidObjectId(id) ) return res.status(422).send("Incorrect Team Id")

        const team = await Team.findById({_id : mongoose.Types.ObjectId(id)})

        res.send(team)
        
    } catch (error) {
        console.log(error);
        if( error instanceof ErrorHandler)
            return res.status(error.code).send(error.message)
        res.status(500).send('Try after sometime')
    }
}

import {User} from "../../models"
import { validate } from "../../services"
import { ErrorHandler } from "../../utils"

export async function updatePassword(req, res){
    try {
        const {password, ["new-password"]:newPasssword} = req.body

        const userDoc = await User.findOne({email: req.email})
        // current password is correct
        const passwordMatch = await userDoc.comparePassword(password)
        if( !passwordMatch ) throw new ErrorHandler({message: "Password wrong.", code: 422})

        // validate new password
        if(!validate.password(newPasssword)) throw new ErrorHandler({message: "New password is not correct", code: 422})
        
        // change current password to new password 
        await userDoc.hashPassword(newPasssword)
        
        // save userDoc
        await userDoc.save()
        
        res.send("Password changed.")
    } catch (error) {
        console.log(error.message);
        if(error instanceof Error)
            return res.status(500).send(error)
        if(error instanceof ErrorHandler)
            return res.status(error.code).send(error.message)
        res.status(500).send('Try After Sometime.')
    }
}
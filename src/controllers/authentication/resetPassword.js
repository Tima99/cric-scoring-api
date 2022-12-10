import { User } from "../../models"
import { validate } from "../../services"

export async function resetPassword(req, res){
    try {
        const {email, newPassword, newConfirmPassword} = req.body

        if( !validate.email(email)) return res.status(422).send("Incorrect email")
        if( !validate.password(newPassword)) return res.status(422).send("Incorrect password")
        if( newPassword !== newConfirmPassword) return res.status(422).send("Password not match!")

        const userDoc = await User.findOne({email})

        if(!userDoc) return res.status(401).send(`User have not account with email ${email}.`)

        await userDoc.hashPassword(newPassword)

        await userDoc.save()

        res.send("Reset Password Sucess!")

    } catch (error) {
        console.log(error);        
        res.status(500).send("Something went wrong...")
    }
}
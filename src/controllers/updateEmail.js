import { User } from "../models"
import { sendEmail, validate } from "../services"
import { ErrorHandler } from "../utils"

export async function updateEmail(req, res){
    try {

        const { email, ["new-email"]: newEmail } = req.body
        // validate email
        const validEmail = validate.email(newEmail)
        if(!validEmail) throw new ErrorHandler({message: "Email not correct.", code: 422}) 
        
        const userDoc = await User.findOne({email})
        if(!userDoc) throw new ErrorHandler({message: "User not created.", code: 401})
        
        // update email
        userDoc.changeEmail(newEmail)
        // generate otp and save
        const OTP = userDoc.generateOtp()
        console.log(`Verify OTP is ${OTP}`)
        // send otp to new email
        await sendEmail({to: newEmail, OTP, subject: "Verify your email via otp"})

        const changeEmailUser = await userDoc.save()

        res.send(changeEmailUser)
    } catch (error) {
        console.log(error)
        if(error instanceof ErrorHandler)
            return res.status(error.code).send(error.message)
        res.status(500).send("Try Again")
    }
}
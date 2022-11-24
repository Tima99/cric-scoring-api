import { User } from "../../models"
import { sendEmail, validate } from "../../services"
import { ErrorHandler } from "../../utils"

export async function updateEmail(req, res){
    try {

        const {changeEmail, email: newEmail } = req.body
        console.log(req.body)
        
        // validate email
        if( !validate.email(newEmail) ) throw new ErrorHandler({message: "Email not correct.", code: 422}) 

        // newEmail is already exists
        if( await User.findOne({email : newEmail}) ) throw new ErrorHandler({message: "New Email already exists.", code: 422})
        
        const userDoc = await User.findOne({changeEmail})
        if(!userDoc) throw new ErrorHandler({message: "User not created.", code: 401})
        
        // update email
        userDoc.changeEmail(newEmail)
        // generate otp and save
        const OTP = userDoc.generateOtp()
        console.log(`Verify OTP is ${OTP}`)
        // send otp to new email
        await sendEmail({to: newEmail, OTP, subject: "Verify your email via otp"})

        const changeEmailUser = await userDoc.save()
        let user = changeEmailUser.toObject()
        delete user.otp
        delete user.password
        
        res.send(changeEmailUser)
    } catch (error) {
        console.log(error)
        if(error instanceof ErrorHandler)
            return res.status(error.code).send(error.message)
        res.status(500).send("Try Again")
    }
}
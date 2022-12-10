import { User } from "../../models";
import { sendEmail } from "../../services";
import { ErrorHandler } from "../../utils";

export async function resendOtp(req, res){
    try {
        const {email, forResetPwd} = req.params

        const user = await User.findOne({email})

        if(!user) throw new ErrorHandler({message: "User not exists. Create Account.", code: 401})

        // check email verified
        if( !forResetPwd && user.isVerified() ) throw new ErrorHandler({message: "Email already verified.", code: 422})
        
        let OTP = null
        if(forResetPwd === "false")
            OTP = user.generateOtp()
        else
            OTP = user.generateResetOtp()

        // send email
        await sendEmail({to: email, OTP, subject: "Verify Email with OTP"})

        await user.save()

        res.send("Email Sent Sucessful.")
        
    } catch (error) {
        console.log(error);
        if(error instanceof ErrorHandler)
            return res.status(error.code).send(error.message)

        res.send(500).send('Try Again')
    }
}
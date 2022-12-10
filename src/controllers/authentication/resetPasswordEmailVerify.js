// reset password link send to email given
import { User } from "../../models";
import { sendEmail, validate } from "../../services"
import { ErrorHandler } from "../../utils";

export async function resetPasswordEmailVerify(req, res){
    try {
        const {email} = req.params
        if(!validate.email(email)) return res.status(422).send("Incorrect Email")

        const user = await User.findOne({email})
        if(!user) throw new ErrorHandler({message: "User not exists. Create Account.", code: 401})

        const OTP = user.generateResetOtp()

        await sendEmail({to: email, 
            OTP, 
            subject: "Reset Password"
        })

        await user.save()

        res.send("For reset password - Check your email. Sent sucessfully!")

    } catch (error) {
        console.log(error);
        if(error instanceof ErrorHandler)
            return res.status(error.code).send(error.message)

        res.status(500).send("Try after sometime")
    }
}
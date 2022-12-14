import { User } from "../../models/index.js"
import { ErrorHandler, SaveJwt } from "../../utils/index.js"
import { sendEmail, validate } from "../../services/index.js"

export async function login(req, res){
    try {
        const {email, password} = req.body
        // console.log(email, password);
        // validate
        const validEmail = validate.email(email)
        if(!validEmail) throw new ErrorHandler({message: "Email not correct.", code: 422}) 
        
        const validPassword = validate.password(password)
        if(!validPassword) throw new ErrorHandler({message: "Password not correct.", code: 422})
        
        const userDoc = await User.findOne({email})
        if(!userDoc) throw new ErrorHandler({message: "User not exists. Register first", code: 401})

        const isPasswordMatch = await userDoc.comparePassword(password)
        if(!isPasswordMatch) throw new ErrorHandler({message: "Password wrong.", code: 422})

        if( userDoc.isVerified() ) {
            // if user verified than save jwt
            await SaveJwt({email}, res)
            let user = userDoc.toObject()
            delete user.otp
            delete user.password
            res.send(user)
        }
        else{
            // if not verified send verify otp
            const OTP = await userDoc.generateOtp()
            await sendEmail({to: email, OTP, subject: "Verified your email"})
            await userDoc.save()
            res.send("Verify your email")
        }

    } catch (error) {
        console.log(error);

        if(error instanceof ErrorHandler)
            return res.status(error.code).send(error.message)
        res.status(500).send('Try After Sometime.')
    }
}
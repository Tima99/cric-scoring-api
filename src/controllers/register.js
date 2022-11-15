import { User } from "../models"
import { ErrorHandler } from "../utils"
import { sendEmail, validate } from "../services"

export async function register(req, res){
    try {
        const {email, password, ["confirm-password"]:confirmPassword } = req.body
        /// console.log(email, password, confirmPassword);

        // Validation 
        // email
        const validEmail = validate.email(email)
        if(!validEmail) throw new ErrorHandler({message: "Email not correct.", code: 422}) 
        
        // password
        const validPassword = validate.password(password)
        if(!validPassword) throw new ErrorHandler({message: "Password not correct.", code: 422})
        
        // match password
        if(password !== confirmPassword) throw new ErrorHandler({message: "Password not match.", code: 422})

        // is already exists
        if(await User.findOne({email})) throw new ErrorHandler({message: "User already exists. Login now.", code: 200})

        // Create Document
        const userDoc =  await User({email})
        // save hash password
        await userDoc.hashPassword(password)
        // generate otp and save
        const OTP = userDoc.generateOtp()
        console.log(`Verify OTP is ${OTP}`)

        // send email
        await sendEmail({to: email, OTP, subject: "Verify your email via otp"})

        // save user
        const user = await userDoc.save()

        res.send(user)
    } catch (error) {
        console.log(error)
        if(error instanceof ErrorHandler)
            return res.status(error.code).send(error.message)
        res.status(500).send("Try after sometime.")
    }
}
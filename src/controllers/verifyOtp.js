import { User } from "../models"
import { ErrorHandler } from "../utils"
import { SaveJwt } from "../services"

export async function verifyOtp(req, res){
    try {
        const { email , otp } = req.body

        const userDoc = await User.findOne({email})

        if(!userDoc) throw new ErrorHandler({message: "User not found", code: 401})        

        if(userDoc.otp.includes("Verified")) throw new ErrorHandler({message: "Email already verified!", code: 200})

        const isVerify = await userDoc.verifyOtp(otp)
        if( !isVerify ) throw new ErrorHandler({message: "Wrong Otp.", code: 422}) 

        await userDoc.save()

        // after register and verify otp save jwt
        const payload = {email}
        await SaveJwt(payload, res)
        
        res.send(userDoc)

    } catch (error) {
        console.log(error)
        if(error instanceof ErrorHandler)
            return res.status(error.code).send(error.message)
        res.status(500).send('Try After Sometime.')
    }
}
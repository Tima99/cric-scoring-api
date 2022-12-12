import { User } from "../../models/index.js"
import { ErrorHandler, SaveJwt } from "../../utils/index.js"

export async function verifyOtp(req, res){
    try {
        const { email , otp , forResetPwd} = req.body

        const userDoc = await User.findOne({email})

        if(!userDoc) throw new ErrorHandler({message: "User not found", code: 401})        

        if(!forResetPwd && userDoc.otp.includes("Verified")) throw new ErrorHandler({message: "Email already verified!", code: 200})

        let isVerify = null
        if(!forResetPwd){
            isVerify = userDoc.verifyOtp(otp)
        }else{
            isVerify = userDoc.verifyResetOtp(otp)
        }

        if( !isVerify ) throw new ErrorHandler({message: "Wrong Otp.", code: 422}) 

        if(forResetPwd){
            userDoc.isResetVerify = true
            await userDoc.save()
            return res.send("Verified")
        }

        await userDoc.save()
        
        // after register and verify otp save jwt
        const payload = {email}
        await SaveJwt(payload, res)
        
        const user = userDoc.toObject()
        delete user.otp
        delete user.password
        res.send(user)

    } catch (error) {
        console.log(error)
        if(error instanceof ErrorHandler)
            return res.status(error.code).send(error.message)
        res.status(500).send('Try After Sometime.')
    }
}
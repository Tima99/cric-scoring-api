import { User } from "../models";
import { ErrorHandler, VerifyJwt } from "../utils";

export async function authenticate(req, res, next) {
    try {
        const { jwt } = req.cookies
        if (!jwt) throw new ErrorHandler({ message: "Unauthorised user.", code: 401 })

        const { email } = await VerifyJwt(jwt)
        // console.log(verify)

        const isUserExist = await User.exists({email})

        if( !isUserExist ) throw new ErrorHandler({message: "email not exists.", code: 401})
        
        req.email = email

        next()
    } catch (error) {
        res.clearCookie('jwt')
        // console.log(error.message);
        if (error instanceof Error)
            return res.status(500).send(error)
        if (error instanceof ErrorHandler)
            return res.status(error.code).send(error.message)
        res.status(500).send('Try After Sometime.')
    }
}
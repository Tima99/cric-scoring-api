import { JWT_SECRET_KEY } from "../../config"
import jwt from "jsonwebtoken"

export async function VerifyJwt(token){
    try {
        const verify = jwt.verify(token, JWT_SECRET_KEY)
        return verify
    } catch (error) {
        return Promise.reject(error)   
    }
}
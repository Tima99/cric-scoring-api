import { JWT_SECRET_KEY } from "../config"
import jwt from "jsonwebtoken"

export async function SaveJwt(payload, res){
    try {
        const token = jwt.sign(payload, JWT_SECRET_KEY)
        const expires = 60
        res.cookie('jwt', token, {
            expiresIn : expires,
            httpOnly: true,
            secure: false
        })
    } catch (error) {
        console.log(error)
        return Promise.reject(error)
    }
}
import { JWT_SECRET_KEY } from "../../config/index.js"
import jwt from "jsonwebtoken"

export async function SaveJwt(payload, res){
    try {
        const expiresIn = 60 * 60 * 24 // hour
        const token = jwt.sign(payload, JWT_SECRET_KEY, {expiresIn})
        res.cookie('jwt', token, {
            expiresIn,
            sameSite:"none",
            httpOnly: "true",
            secure: "true"
        })
    } catch (error) {
        // console.log(error)
        return Promise.reject(error)
    }
}
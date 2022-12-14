import { Router } from "express";
import { register, login, updateEmail, verifyOtp, getMatches, resetPassword } from "../controllers/index.js";

const route = Router()

route.post('/register', register)
route.post('/login', login)
route.post('/update/email', updateEmail)
route.post('/verify/otp', verifyOtp)
route.post('/resetPassword', resetPassword)

// provide array of match ids (string)
route.post("/getMatches", getMatches)

export default route;
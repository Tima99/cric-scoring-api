import { Router } from "express";
import { register, login, updateEmail, verifyOtp, getMatches } from "../controllers";

const route = Router()

route.post('/register', register)
route.post('/login', login)
route.post('/update/email', updateEmail)
route.post('/verify/otp', verifyOtp)

// provide array of match ids (string)
route.post("/getMatches", getMatches)

export default route;
import { Router } from "express";
import { register, login, updateEmail, verifyOtp, createPlayer } from "../controllers";

const route = Router()

route.post('/register', register)
route.post('/login', login)
route.post('/update/email', updateEmail)
route.post('/verify/otp', verifyOtp)

route.post('/createPlayer', createPlayer)

export default route;
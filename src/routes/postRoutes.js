import { Router } from "express";
import { register, login, updateEmail, verifyOtp, resetPassword } from "../controllers";

const route = Router()

route.post('/register', register)
route.post('/login', login)
route.post('/update/email', updateEmail)
route.post('/verify/otp', verifyOtp)
route.post('/resetPassword', resetPassword)

export default route;
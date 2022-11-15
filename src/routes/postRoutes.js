import { Router } from "express";
import { register, login, updateEmail, verifyOtp, updatePassword } from "../controllers";
import { authenticate } from "../middlewares/authenticate";

const route = Router()

route.post('/register', register)
route.post('/login', login)
route.post('/update/email', updateEmail)
route.post('/verify/otp', verifyOtp)

export default route;
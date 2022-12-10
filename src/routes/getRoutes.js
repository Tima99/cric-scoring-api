import { Router } from "express";
import { resendOtp, resetPasswordEmailVerify } from "../controllers";

const route = Router()

route.get('/', (req, res) => res.send("Server Started 😍😍"))
route.get('/resend/otp/:email', resendOtp)
route.get('/verifyFor/resetPassword/:email', resetPasswordEmailVerify)

export default route;
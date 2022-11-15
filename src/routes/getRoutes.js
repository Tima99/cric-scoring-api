import { Router } from "express";
import { resendOtp } from "../controllers/resendOtp";

const route = Router()

route.get('/', (req, res) => res.send("Server Started 😍😍"))
route.get('/resend/otp/:email', resendOtp)

export default route;
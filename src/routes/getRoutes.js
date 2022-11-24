import { Router } from "express";
import { getTeam, resendOtp, search } from "../controllers";

const route = Router()

route.get('/', (req, res) => res.send("Server Started 😍😍"))
route.get('/resend/otp/:email', resendOtp)
route.get('/search', search)
route.get('/getTeam/:id', getTeam)

export default route;
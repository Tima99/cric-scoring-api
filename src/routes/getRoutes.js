import { Router } from "express";
import { getMatch, getTeam, resendOtp, search, resendOtp, resetPasswordEmailVerify } from "../controllers";

const route = Router()


route.get('/', (req, res) => res.send("Server Started 😍😍"))
route.get('/resend/otp/:email', resendOtp)
route.get('/search', search)
route.get('/getTeam/:id', getTeam)
route.get('/getMatch/:matchId', getMatch)
route.get('/verifyFor/resetPassword/:email', resetPasswordEmailVerify)

export default route;
import { Router } from "express";
import { getMatch, getTeam, resendOtp, search, resetPasswordEmailVerify, getPlayer } from "../controllers";

const route = Router()


route.get('/', (req, res) => res.send("Server Started 😍😍"))
route.get('/resend/otp/:email/:forResetPwd', resendOtp)
route.get('/search', search)
route.get('/getTeam/:id', getTeam)
route.get('/getMatch/:matchId', getMatch)
route.get('/verifyFor/resetPassword/:email', resetPasswordEmailVerify)
route.get('/player/:_id', getPlayer)

export default route;
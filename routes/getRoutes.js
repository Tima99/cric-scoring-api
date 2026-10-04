import { Router } from "express";
import { getPublicMatch, listMatches, getTeam, resendOtp, search, resetPasswordEmailVerify, getPlayer } from "../controllers/index.js";

const route = Router()


route.get('/resend/otp/:email/:forResetPwd', resendOtp)
route.get('/search', search)
route.get('/getTeam/:id', getTeam)
// public (no login): view a match and list matches
route.get('/getMatch/:matchId', getPublicMatch)
route.get('/matches', listMatches)
route.get('/verifyFor/resetPassword/:email', resetPasswordEmailVerify)
route.get('/player/:_id', getPlayer)

export default route;
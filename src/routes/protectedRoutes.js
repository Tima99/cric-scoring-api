import { Router } from "express";
import { updatePassword, userAuthentic, logout, playerAuthentic } from "../controllers";

const route = Router()

// Post Protected Routes
route.post('/update/password', updatePassword)

// Get Protected Routes
route.get('/auth', userAuthentic)
route.get('/authPlayer', playerAuthentic)
route.get('/logout', logout)

export default route;


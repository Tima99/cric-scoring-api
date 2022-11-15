import { Router } from "express";
import { updatePassword, userAuthentic, logout } from "../controllers";

const route = Router()

// Post Protected Routes
route.post('/update/password', updatePassword)

// Get Protected Routes
route.get('/auth', userAuthentic)
route.get('/logout', logout)

export default route;


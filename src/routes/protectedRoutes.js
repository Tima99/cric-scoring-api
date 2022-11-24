import { Router } from "express";
import { updatePassword, userAuthentic, logout, createTeam, addPlayer, myTeams, removePlayer, leftTeam, createPlayer } from "../controllers";

const route = Router()

// Post Protected Routes
route.post('/update/password', updatePassword)

route.post('/createPlayer', createPlayer)

route.post('/createTeam', createTeam)
route.post('/addPlayer', addPlayer)
route.post('/removePlayer', removePlayer, leftTeam)
route.post('/leftTeam', leftTeam)

// Get Protected Routes
route.get('/auth', userAuthentic)
route.get('/logout', logout)

route.get('/myTeams', myTeams)

export default route;


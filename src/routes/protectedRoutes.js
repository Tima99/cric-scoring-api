import { Router } from "express";
import {
    updatePassword,
    userAuthentic,
    logout,
    createTeam,
    addPlayer,
    myTeams,
    removePlayer,
    leftTeam,
    createPlayer,
    createMatch,
    myMatches,
    getMatch,
    playerAuthentic
} from "../controllers";
import { socketConnect } from "../middlewares";

const route = Router();

// Post Protected Routes
route.post("/update/password", updatePassword);

route.post("/createPlayer", createPlayer);

route.post("/createTeam", createTeam);
route.post("/addPlayer", addPlayer);
route.post("/removePlayer", removePlayer, leftTeam);
route.post("/leftTeam", leftTeam);

// matches
route.post("/createMatch", createMatch);

// Get Protected Routes
route.get('/auth', userAuthentic)
route.get('/authPlayer', playerAuthentic)
route.get('/logout', logout)

route.get("/myTeams", myTeams);

route.get("/myMatches", myMatches);

route.get('/scoring/getMatch/:matchId', socketConnect, getMatch)


export default route;

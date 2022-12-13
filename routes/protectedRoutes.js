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
    getMatch,
    playerAuthentic,
    editPlayer,
    opponentsTeam,
    getMyMatches,
    sendMyMatches,
    deleteTeam
} from "../controllers/index.js";

const route = Router();

// Post Protected Routes
route.post("/update/password", updatePassword);

route.post("/createPlayer", createPlayer);
route.post("/editPlayer", editPlayer);

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

route.get("/deleteTeam/:teamId", deleteTeam)
route.get("/myTeams", myTeams);
route.get("/myOpponentsTeam", getMyMatches, opponentsTeam);

route.get("/myMatches", getMyMatches, sendMyMatches);

route.get('/scoring/getMatch/:matchId', getMatch)


export default route;

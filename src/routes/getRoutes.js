import { Router } from "express";

const route = Router()

route.get('/', (req, res) => res.send("Server Started 😍😍"))


export default route;
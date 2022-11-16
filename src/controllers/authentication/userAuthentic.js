export async function userAuthentic(req, res){
    res.send(`User (${req.email}) Authenticated!`)
}
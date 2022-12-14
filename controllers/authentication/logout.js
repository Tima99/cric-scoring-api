export async function logout(req, res){
    try {
        if(!req.email) throw new Error("Unauthorised user")

        res.clearCookie('jwt', {
            sameSite:"none",
            httpOnly: "true",
            secure: "true"
        })

        res.send(`${req.email} Logout Sucess.`)
    } catch (error) {
        console.log(error);
        res.status(500).send(error.message)
    }
}
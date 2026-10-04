import Validator from "validator"

export const validate = {
    // No strength rules; only require a non-empty string (bcrypt needs one)
    password : password => typeof password === "string" && password.length > 0,

    email : email => {
        return Validator.isEmail(email)
    },

    name : name => {
        return Validator.isLength(name || '', {
            min: 3, 
            max: 15
        })
    }
}
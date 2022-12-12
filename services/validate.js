import Validator from "validator"

export const validate = {
    password : password => {
        const match = Validator.isStrongPassword(password, {
            minLength: 6,
            minLowercase: 1,
            minSymbols: 1,
            minNumbers: 1,
            minUppercase: 0
        })

        return match
    },

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
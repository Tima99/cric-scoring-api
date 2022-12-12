import mongoose from "mongoose";
import bcrypt from "bcrypt"
import { generateOtp } from "../utils";

const Schema = mongoose.Schema

const userSchema = new Schema({
    email : {type: String, required: true, unique: true},
    password: {type: String},
    otp: {type: String},
    resetOtp: {type: String},
    isResetVerify: {type: Boolean, default: false}
}, {timestamps : true})

userSchema.methods.generateOtp = function(){
    const OTP = generateOtp()
    this.otp = OTP
    return OTP
}
userSchema.methods.generateResetOtp = function(){
    const OTP = generateOtp()
    this.resetOtp = OTP
    return OTP
}
userSchema.methods.verifyOtp = function(userOtp){
    const verify = this.otp === userOtp
    if(verify) this.otp = "Verified"
    return verify
}
userSchema.methods.verifyResetOtp = function(userOtp){
    const verify = this.resetOtp === userOtp
    if(verify) this.isResetVerify = true
    return verify
}
userSchema.methods.isVerified = function(){
    return this.otp.includes("Verified")
}

userSchema.methods.hashPassword = async function(password){
    try {
        const salt = await bcrypt.genSalt(10)
        const hash = await bcrypt.hash(password, salt)
        this.password = hash
    } catch (error) {
        console.log(error);
        return Promise.reject(error)   
    }
}

userSchema.methods.comparePassword = async function(password){
    try {
        const result = await bcrypt.compare(password, this.password)
        // true if match otherwise false

        return result
    } catch (error) {
        console.log(error)
        return Promise.reject(error)   
    }
}

userSchema.methods.changeEmail = function(email){
    this.email = email
}

const User = mongoose.model('User', userSchema, "users")

export default User
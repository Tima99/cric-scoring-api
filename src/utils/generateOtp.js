import { generate } from "otp-generator";

const OTP_LENGTH = 6

export function generateOtp(){
    const OTP = generate(OTP_LENGTH, {upperCaseAlphabets: false, specialChars: false, lowerCaseAlphabets: false})
    return OTP
}
import { generate } from 'otp-generator'

export const generateOTP = () => {
    return generate(6, {
        upperCaseAlphabets: false,
        lowerCaseAlphabets: false,
        specialChars: false
    })
}
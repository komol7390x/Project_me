import { generate } from 'otp-generator'

export const generateOTP = (number:number) => {

    return generate(number, {
        upperCaseAlphabets: false,
        lowerCaseAlphabets: false,
        specialChars: false
    })
}
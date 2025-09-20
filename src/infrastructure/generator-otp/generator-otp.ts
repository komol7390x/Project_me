import { generate } from 'otp-generator'

export const generatorOTP=(number:number)=>{
    return generate(number,{
        lowerCaseAlphabets:false,
        upperCaseAlphabets:false,
        specialChars:false
    })
}
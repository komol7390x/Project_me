import { ApiProperty } from "@nestjs/swagger"
import { IsEmail, IsNotEmpty, IsNumber, } from "class-validator"

export class EmailWithDto {
    @ApiProperty({ description: 'User email', example: 'www.komol7390@gmail.com' })
    @IsEmail()
    @IsNotEmpty()
    email: string

     @ApiProperty({ description: 'OTP', example: '123456' })
    @IsNumber()
    @IsNotEmpty()
    otp: number
}
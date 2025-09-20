import { ApiProperty } from "@nestjs/swagger"
import { IsEmail, IsNotEmpty, IsNumber, IsStrongPassword, } from "class-validator"

export class EmailPassword {
  @ApiProperty({ description: 'User email', example: 'www.komol7390@gmail.com' })
    @IsEmail()
    @IsNotEmpty()
    email: string

    @ApiProperty({ description: 'nes password', example: '@Userr000012!@' })
    @IsStrongPassword()
    @IsNotEmpty()
    new_password: string
}
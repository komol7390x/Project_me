import { ApiProperty } from "@nestjs/swagger"
import { IsEmail, IsNotEmpty, IsString, IsStrongPassword } from "class-validator"

export class CreateUserDto {
    @ApiProperty({ description: 'User full name', example: 'User User' })
    @IsString()
    @IsNotEmpty()
    full_name: string

    @ApiProperty({ description: 'User email', example: 'www.komol7390@gmail.com' })
    @IsEmail()
    @IsNotEmpty()
    email: string

    @ApiProperty({ description: 'User password', example: '@User123!@' })
    @IsStrongPassword()
    @IsNotEmpty()
    password: string
}

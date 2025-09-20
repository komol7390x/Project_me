import { ApiProperty } from "@nestjs/swagger"
import { IsEmail, IsNotEmpty } from "class-validator"

export class EmailUserDto {
  @ApiProperty({ description: 'User email', example: 'www.komol7390@gmail.com' })
    @IsEmail()
    @IsNotEmpty()
    email: string
}
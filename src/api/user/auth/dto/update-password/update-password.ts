import { ApiProperty } from "@nestjs/swagger"
import { IsNotEmpty, IsString, IsStrongPassword } from "class-validator"

export class UpdatePassword {
    @ApiProperty({ description: 'Admin old password', example: '@Admin123!@' })
    @IsStrongPassword()
    @IsString()
    @IsNotEmpty()
    old_password: string

    @ApiProperty({ description: 'Admin new password', example: '@NewAdmin123!@' })
    @IsStrongPassword()
    @IsString()
    @IsNotEmpty()
    new_password: string
}
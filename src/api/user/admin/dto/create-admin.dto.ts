import { ApiProperty } from "@nestjs/swagger";
import { IsNotEmpty, IsString, IsStrongPassword } from "class-validator";

export class CreateAdminDto {
    @ApiProperty({ description: 'Admin full name', example: 'Admin User' })
    @IsString()
    @IsNotEmpty()
    full_name: string

    @ApiProperty({ description: 'Admin full email', example: 'admin123' })
    @IsNotEmpty()
    username: string

    @ApiProperty({ description: 'Admin full password', example: '@Admin123!@' })
    @IsStrongPassword()
    @IsNotEmpty()
    password: string
}

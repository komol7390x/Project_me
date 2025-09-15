import { ApiProperty, ApiPropertyOptional } from '@nestjs/swagger';
import {
  IsBoolean,
  IsNotEmpty,
  IsOptional,
  IsString,
  IsStrongPassword,
  MinLength,
} from 'class-validator';

export class CreateAdminDto {
  // --------------------------------------- NAME ---------------------------------------
  @ApiProperty({
    description: 'Adminning ismi',
    example: 'John Doe',
    minLength: 3,
  })
  @MinLength(3)
  @IsString()
  @IsNotEmpty()
  name?: string;

  // --------------------------------------- USERNAME ---------------------------------------
  @ApiProperty({
    description: 'Adminning username',
    example: 'johndoe123',
    minLength: 3,
  })
  @MinLength(3)
  @IsString()
  @IsNotEmpty()
  username: string;

  // --------------------------------------- PASSSWORD ---------------------------------------
  @ApiProperty({
    description: 'Adminning kuchli paroli',
    example: 'Str0ngP@ssword!',
  })
  @IsStrongPassword()
  @IsNotEmpty()
  password: string;

  // --------------------------------------- IS ACTIVE ---------------------------------------
  @ApiPropertyOptional({
    description: 'Admin faol (true = mavjud, false = sotilgan)',
    example: true,
  })
  @IsBoolean()
  @IsOptional()
  is_active?: boolean;

    // --------------------------------------- IS DELETED ---------------------------------------

  @IsBoolean()
  @IsOptional()
  is_deleted?:boolean
}

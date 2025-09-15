import {
  IsEmail,
  IsNotEmpty,
  IsNumber,
  IsOptional,
  IsString,
  Matches,
} from 'class-validator';
import { ApiProperty, ApiPropertyOptional } from '@nestjs/swagger';

export class CreateAdminDto {
  @ApiProperty({
    example: 'Komol Komolov',
    description: "Adminning to'liq ismi",
  })
  @IsString()
  @IsNotEmpty()
  full_name: string;

  @ApiProperty({
    example: 'komol@example.com',
    description: "Adminning email manzili (unique bo'lishi kerak)",
  })
  @IsEmail()
  @IsNotEmpty()
  email: string;

  @ApiProperty({
    example: 25,
    description: 'Adminning yoshi',
  })
  @IsNumber()
  @IsNotEmpty()
  age: number;

  @ApiPropertyOptional({
    example: '998901234567',
    description: 'Telefon raqami, +998 bilan boshlanishi kerak',
  })
  @IsString()
  @Matches(/^998/, { message: 'Telefon 998 bilan boshlanishi kerak' })
  @IsOptional()
  phone_number: string;
}

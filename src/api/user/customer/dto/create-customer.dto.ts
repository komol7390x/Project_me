import { ApiProperty, ApiPropertyOptional } from '@nestjs/swagger';
import { IsBoolean, IsEmail, IsNotEmpty, IsNumber, IsOptional, IsString, IsStrongPassword, Max, Min, MinLength } from 'class-validator';

export class CreateCustomerDto {
  // --------------------------------------- NAME ---------------------------------------
  @ApiProperty({
    description: "Mijozning to'liq ismi",
    example: 'Alice Johnson',
    minLength: 3,
  })
  @MinLength(3)
  @IsString()
  @IsNotEmpty()
  name: string;

  // --------------------------------------- EMAIL---------------------------------------
  @ApiProperty({
    description: 'Mijozning email manzili',
    example: 'www.komol8689@gmail.com',
  })
  @IsEmail()
  @IsString()
  @IsNotEmpty()
  email: string;

  // --------------------------------------- PASSWORD ---------------------------------------
  @ApiProperty({
    description: 'Mijozning kuchli paroli',
    example: 'Str0ngP@ssword!',
  })
  @IsStrongPassword()
  @IsNotEmpty()
  password: string;

  // --------------------------------------- PHONE NUMBER ---------------------------------------

  @ApiProperty({
    description: 'Mijozning telefon raqami',
    example: 998935720473,
  })
  @IsNotEmpty()
  @IsNumber({}, { message: 'Telefon raqam raqam bo\'lishi shart' })
  @Min(998000000000, { message: 'Telefon raqam noto\'g\'ri' })
  @Max(998999999999, { message: 'Telefon raqam noto\'g\'ri' })
  phone_number: number;

  // --------------------------------------- IS ACTIVE ---------------------------------------
  @ApiPropertyOptional({
    description: 'Customer faol (true = faol, false = faol emas)',
    example: true,
  })
  @IsBoolean()
  @IsOptional()
  is_active?: boolean;

  // --------------------------------------- IS DELETED ---------------------------------------

  @IsBoolean()
  @IsOptional()
  is_deleted?: boolean;
}

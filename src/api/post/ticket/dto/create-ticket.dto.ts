import { ApiProperty, ApiPropertyOptional } from '@nestjs/swagger';
import { IsBoolean, IsInt, IsNotEmpty, IsNumber, IsOptional, IsString, Matches, Min } from "class-validator";

export class CreateTicketDto {
  // ------------------------------ PRICE------------------------------
  @ApiProperty({
    description: 'Bilet narxi',
    example: 15.5,
    minimum: 0,
  })
  @IsNumber()
  @Min(0)
  @IsNotEmpty()
  price: number;

  // ------------------------------ SHOW TIME ID ------------------------------
  @ApiProperty({
    description: 'Showtime ID',
    example: 5,
  })
  @IsInt()
  @IsNotEmpty()
  showtime_id: number;

  // ------------------------------ START TIME ------------------------------
  @ApiProperty({
    description: 'Filmnig boshlanish vaqti (HH:mm:ss formatida)',
    example: '13:00:00',
  })
  @Matches(/^([0-1]?[0-9]|2[0-3]):[0-5][0-9]:[0-5][0-9]$/, {
    message: 'Begin movie time must be in HH:mm:ss format',
  })
  @IsString()
  @IsNotEmpty()
  start_time: string;

  // ------------------------------ END TIME ------------------------------

  @ApiProperty({
    description: 'Filmnig tugash vaqti (HH:mm:ss formatida)',
    example: '15:00:00',
  })
  @Matches(/^([0-1]?[0-9]|2[0-3]):[0-5][0-9]:[0-5][0-9]$/, {
    message: 'End movie time must be in HH:mm:ss format',
  })
  @IsString()
  @IsNotEmpty()
  end_time: string;

  // ------------------------------ STATUS ------------------------------
  @ApiPropertyOptional({
    description: 'Bilet holati (true = mavjud, false = sotilgan)',
    example: true,
  })
  @IsBoolean()
  @IsOptional()
  status?: boolean;
}

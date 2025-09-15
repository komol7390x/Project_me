import { ApiProperty, ApiPropertyOptional } from '@nestjs/swagger';
import {
  IsBoolean,
  IsInt,
  IsNotEmpty,
  IsOptional,
  IsString,
  Matches,
  Min,
} from 'class-validator';

export class CreateShowtimeDto {
  // ------------------------------ MOVIE ID ------------------------------
  @ApiProperty({
    description: 'Film ID',
    example: 10,
  })
  @IsInt()
  @IsNotEmpty()
  movie_id: number;

  // ------------------------------ STOCK QUANTITY ------------------------------
  @ApiProperty({
    description: 'Biletlar soni',
    example: 100,
    minimum: 0,
  })
  @IsInt()
  @Min(0)
  @IsNotEmpty()
  ticket_quantity: number;

  // ------------------------------ ROOM ID ------------------------------
  @ApiProperty({
    description: 'Xona ID',
    example: 1,
  })
  @IsInt()
  @IsNotEmpty()
  room_id: number;

  // ------------------------------ IS ACTIVE ------------------------------
  @ApiPropertyOptional({
    description: "Showtime faol yoki yo'qligi",
    example: true,
  })
  @IsOptional()
  @IsBoolean()
  is_active?: boolean;

  // ------------------------------ SEAT QUANTITY------------------------------

  @IsInt()
  @IsOptional()
  seat_qantity?: number;
}

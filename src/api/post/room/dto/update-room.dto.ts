import { ApiPropertyOptional } from '@nestjs/swagger';
import { IsOptional, IsNumber, IsString, IsBoolean } from 'class-validator';
import { Type } from 'class-transformer';

export class UpdateRoomDto {
  @ApiPropertyOptional({ example: 'Room A', description: 'Room name' })
  @IsOptional()
  @IsString()
  name?: string;

  @ApiPropertyOptional({ example: '1st Floor', description: 'Room location' })
  @IsOptional()
  @IsString()
  location?: string;

  @ApiPropertyOptional({ example: 100, description: 'Total seats in room' })
  @IsOptional()
  @IsNumber()
  @Type(() => Number)
  total_seats?: number;

  @ApiPropertyOptional({ example: true, description: 'Is room active?' })
  @IsOptional()
  @IsBoolean()
  @Type(() => Boolean)
  is_active?: boolean;
}

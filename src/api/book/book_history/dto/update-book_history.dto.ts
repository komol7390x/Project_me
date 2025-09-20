import { ApiPropertyOptional } from '@nestjs/swagger';
import { IsOptional, IsString } from 'class-validator';

export class UpdateBookHistoryDto {
  @ApiPropertyOptional({ description: 'Action', example: 'action' })
  @IsString()
  @IsOptional()
  action?: string;
}

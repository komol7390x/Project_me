import { ApiProperty } from '@nestjs/swagger';
import {IsNotEmpty, IsString } from 'class-validator';

export class CreateBookHistoryDto {
  @ApiProperty({ description: 'action',example:'Action' })
  @IsString()
  @IsNotEmpty()
  action: string;
}

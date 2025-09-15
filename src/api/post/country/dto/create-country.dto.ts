import { ApiProperty } from '@nestjs/swagger';
import { IsNotEmpty, IsString } from 'class-validator';

export class CreateCountryDto {
  // ----------------- NAME -----------------
  @ApiProperty({
    description: 'Mamlakat nomi',
    example: 'Uzbeksiton',
  })
  @IsString()
  @IsNotEmpty()
  name: string;
}

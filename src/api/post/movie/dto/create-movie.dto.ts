import { ApiProperty, ApiPropertyOptional } from '@nestjs/swagger';
import {
  IsDateString,
  IsEnum,
  IsInt,
  IsNotEmpty,
  IsOptional,
  IsString,
  IsUrl,
  Matches,
} from 'class-validator';
import { Country } from 'src/common/enum/country';
import { Languages } from 'src/common/enum/lang';

export class CreateMovieDto {
  // ------------------------------ TITLE ------------------------------

  @ApiProperty({
    description: 'Filmnig sarlavhasi',
    example: 'Inception',
  })
  @IsString()
  @IsNotEmpty()
  title: string;

  // ------------------------------ DESCRIPTION ------------------------------

  @ApiPropertyOptional({
    description: 'Filmnig tavsifi',
    example: 'A mind-bending thriller about dreams within dreams.',
  })
  @IsOptional()
  @IsString()
  description?: string;

  // ------------------------------ DURATION ------------------------------

  @ApiProperty({
    description: 'Filmnig davomiyligi (HH:mm:ss formatida)',
    example: '02:15:20',
  })
  @IsNotEmpty()
  @Matches(/^([0-1]?[0-9]|2[0-3]):[0-5][0-9]:[0-5][0-9]$/, {
    message: 'Duration must be in HH:mm:ss format',
  })
  duration: string;

  // ------------------------------ REALASE DATE ------------------------------

  @ApiPropertyOptional({
    description: 'Filmnig chiqish sanasi (YYYY-MM-DD formatida)',
    example: '2010-07-16',
  })
  @IsOptional()
  @Matches(/^\d{4}-(0[1-9]|1[0-2])-(0[1-9]|[12]\d|3[01])$/, {
    message: 'realase_date must be in YYYY-MM-DD format',
  })
  realase_date?: string;

  // ------------------------------ IMAGE URL ------------------------------

  @ApiProperty({
    description: 'Filmnig rasmi URL',
    example: 'https://example.com/movie-image.jpg',
  })
  @IsUrl()
  @IsNotEmpty()
  image_url: string;

  // ------------------------------ VIDEO URL ------------------------------

  @ApiProperty({
    description: 'Filmnig video URL',
    example: 'https://example.com/movie-video.mp4',
  })
  @IsUrl()
  @IsNotEmpty()
  video_url: string;

  // ------------------------------ LANGUAGES ------------------------------

  @ApiPropertyOptional({
    description: 'Filmnig tili',
    enum: Languages,
  })
  @IsOptional()
  @IsEnum(Languages)
  language?: Languages;

  // ------------------------------ COUNTRY ------------------------------

  @ApiPropertyOptional({
    description: 'Filmnig mamlakati ID',
    example: 1,
  })
  @IsInt()
  @IsNotEmpty()
  country_id: number;

  // ------------------------------ GENRE ID ------------------------------

  @ApiProperty({
    description: 'Filmnig janri ID',
    example: 1,
  })
  @IsInt()
  @IsNotEmpty()
  genre_id: number;

  // ------------------------------ ADMIN ID ------------------------------

  @ApiProperty({
    description: 'Filmnig admin ID',
    example: 1,
  })
  @IsInt()
  @IsNotEmpty()
  admin_id: number;
}

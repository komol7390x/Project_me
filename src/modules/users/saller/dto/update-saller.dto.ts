import { PartialType } from '@nestjs/mapped-types';
import { CreateSallerDto } from './create-saller.dto';

export class UpdateSallerDto extends PartialType(CreateSallerDto) {}

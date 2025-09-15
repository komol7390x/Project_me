import { PartialType } from '@nestjs/swagger';
import { CreateAdminDto } from './create-admin.dto';
import { IsOptional, IsString } from 'class-validator';

export class UpdateAdminDto extends PartialType(CreateAdminDto) {}

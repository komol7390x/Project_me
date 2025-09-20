import { PartialType } from '@nestjs/swagger';
import { CreateAdminDto } from './create-admin.dto';
import { IsBoolean, IsEnum, IsOptional, IsString } from 'class-validator';
import { AdminRoles } from 'src/common/enum/Role';

export class UpdateAdminDto extends PartialType(CreateAdminDto) {
    @IsBoolean()
    @IsOptional()
    is_active?: boolean

    @IsEnum(AdminRoles)
    @IsOptional()
    role?: AdminRoles
}

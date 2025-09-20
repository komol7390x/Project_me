import { PartialType } from '@nestjs/swagger';
import { CreateUserDto } from './create-user.dto';
import { IsBoolean, IsEnum, IsOptional } from 'class-validator';
import { UserRoles } from 'src/common/enum/Role';

export class UpdateUserDto extends PartialType(CreateUserDto) {
    @IsBoolean()
    @IsOptional()
    is_active?: boolean

    @IsEnum(UserRoles)
    @IsOptional()
    role?: UserRoles
}

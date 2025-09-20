import { BaseEntity } from "src/common/database/base-entity";
import { AdminRoles } from "src/common/enum/Role";
import { Column, Entity } from "typeorm";

@Entity('admin')
export class AdminEntity extends BaseEntity {

    // ------------------ FULL NAME ------------------

    @Column({ type: 'varchar' })
    full_name: string

    // ------------------ USERNAME ------------------

    @Column({ type: 'varchar', unique: true })
    username: string

    // ------------------ PASSWORD ------------------

    @Column({ type: 'varchar' })
    hashed_password: string

    // ------------------ ROLE ------------------

    @Column({ type: 'enum', enum: AdminRoles, default: AdminRoles.ADMIN })
    role: AdminRoles

    // ------------------ IS ACTIVE ------------------

    @Column({ type: 'boolean', nullable: true, default: true })
    is_active: boolean
}
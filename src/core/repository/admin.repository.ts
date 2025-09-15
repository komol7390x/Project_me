import { Repository } from 'typeorm';
import { AdminEntity } from '../entity/users/admin.entity';

export type AdminRepository = Repository<AdminEntity>;

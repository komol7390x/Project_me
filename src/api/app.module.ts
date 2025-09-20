import { Module } from '@nestjs/common';
import { UserModule } from './user/user/user.module';
import { BookModule } from './book/book/book.module';
import { BorrowModule } from './book/borrow/borrow.module';
import { BookHistoryModule } from './book/book_history/book_history.module';
import { TypeOrmModule } from '@nestjs/typeorm';
import { config } from 'src/config/env-config';
import { JwtModule } from '@nestjs/jwt';
import { AdminModule } from './user/admin/admin.module';
import { StatisticaModule } from './post/statistica/statistica.module';


@Module({
  // -------------------- DATABASE --------------------

  imports: [TypeOrmModule.forRoot({
    type: 'postgres',
    url: (config.DB_URL),
    synchronize: true,
    entities: ['dist/core/entity/*.entity{.ts,.js}'],
    autoLoadEntities: true, logging: ['error', 'warn'],
  }),

  // -------------------- JWT --------------------

  JwtModule.register({ global: true }),

    // -------------------- MODULE --------------------

    UserModule, BookModule, BorrowModule, BookHistoryModule, AdminModule, StatisticaModule],
})
export class AppModule { }

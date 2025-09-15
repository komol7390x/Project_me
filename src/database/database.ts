import { Injectable, OnModuleInit } from '@nestjs/common';
import { DataSource } from 'typeorm';

@Injectable()
export class AppService implements OnModuleInit {
  constructor(private dataSource: DataSource) {}

  async onModuleInit() {
    try {
      await this.dataSource.query('SELECT NOW()');
      console.log('✅ PostgreSQL ulanish muvaffaqiyatli!');
    } catch (err) {
      console.error('❌ PostgreSQL ulanish xatosi:', err);
    }
  }
}
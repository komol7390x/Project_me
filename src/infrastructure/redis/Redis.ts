import Redis from 'ioredis';
import { Injectable, OnModuleInit, OnModuleDestroy, BadRequestException } from '@nestjs/common';
import { config } from 'src/config/env-config'; // sizning config faylingiz

@Injectable()
export class RedisService implements OnModuleInit, OnModuleDestroy {
  private redis: Redis;

  onModuleInit() {
    this.redis = new Redis({
      host:  '127.0.0.1',
      port:  6379,
      password:'7390',
    });
  }
  // ---------------------------- SET VALUE ----------------------------
  async setRedis(key: string, value: string, expireSeconds: number =500) {
    
    const ttl = Number(expireSeconds);

    // expire if string value
    if (isNaN(ttl) || ttl <= 0) {
      throw new BadRequestException(`Invalid expireSeconds value: ${expireSeconds}`);
    }

    // save value on redis
    await this.redis.set(key, value, 'EX', expireSeconds);
  }

  // ---------------------------- GET VALUE ----------------------------
  async getRedis(key: string) {
    // get value on redis
    return await this.redis.get(key);
  }

  // ---------------------------- DELETE VALUE ----------------------------
  async delRedis(key: string) {

    // delete on redis
    return await this.redis.del(key);
  }

  async onModuleDestroy() {
    await this.redis.quit();
  }
}
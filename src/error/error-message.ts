import { LoggerService } from '@nestjs/common';

export class OnlyErrorLogger implements LoggerService {
  log(message: any) {
    // hech narsa chiqarmaymiz
  }
  warn(message: any) {
    // hech narsa chiqarmaymiz
  }
  debug(message: any) {
    // hech narsa chiqarmaymiz
  }
  verbose(message: any) {
    // hech narsa chiqarmaymiz
  }
  error(message: any, trace?: string) {
    if (typeof message === 'string') {
      console.error(message);
    } else if (message?.message) {
      console.error(message.message);
    } else {
      console.error(message);
    }
    if (trace) {
      console.error(trace);
    }
  }
}

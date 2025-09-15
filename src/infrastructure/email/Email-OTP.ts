import { Injectable, InternalServerErrorException } from '@nestjs/common';
import { MailerService } from '@nestjs-modules/mailer';

@Injectable()
export class EmailService {
  constructor(private readonly mailerService: MailerService) {}

  async sendOtpEmail(to: string, otp: string) {
    try {
      await this.mailerService.sendMail({
        to,
        subject: 'Your OTP Code',
        text: `Hello!\n\nFrom: ${to}\n\nYour OTP code is: ${otp}\n\nDo not share this code with anyone.`,
      });
    } catch (error) {
      throw new InternalServerErrorException(`Error export OTP ${error}`);
    }
  }
}

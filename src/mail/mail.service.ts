import { InjectQueue } from '@nestjs/bull';
import { Injectable } from '@nestjs/common';
import { Queue } from 'bull';

@Injectable()
export class MailService {
  constructor(
    @InjectQueue('mailsend')
    private mailQueue: Queue,
  ) {}

  async sendWelcomeEmail(email: string): Promise<boolean> {
    try {
      this.mailQueue.add('welcome', {
        email: email,
      });
      return true;
    } catch (err) {
      console.log('Error queueing confirmation email to user.');
      return false;
    }
  }
}

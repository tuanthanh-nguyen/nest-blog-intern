import { MailerService } from '@nestjs-modules/mailer';
import { InjectQueue } from '@nestjs/bull';
import { Injectable } from '@nestjs/common';
import { Queue } from 'bull';
import { UserService } from 'src/user/user.service';
import { Repository } from 'typeorm';
import { User } from 'src/user/entities/user.entity';
import { InjectRepository } from '@nestjs/typeorm';

@Injectable()
export class MailService {
  constructor(
    @InjectQueue('mailsend')
    private mailQueue: Queue,
    private readonly mailersService: MailerService,
    private readonly usersService: UserService,
    @InjectRepository(User)
    private readonly userRepository: Repository<User>,
  ) {}

  async sendConfirmationEmail(email: string): Promise<boolean> {
    try {
      this.mailQueue.add('confirmation', {
        email: email,
        id: 1 
      });
      return true;
    } catch (err) {
      console.log('Error queueing confirmation email to user.');
      return false;
    }
  }

  public sendMail(toMail: string, verify_url: string) {
    this.mailersService
      .sendMail({
        to: toMail,
        from: process.env.MAIL_USER,
        subject: 'Email Verification',
        html: `click this link to verify your email: ${verify_url}`, // HTML body content
      })
      .then(async (success) => {
        console.log(success, 'Mail sent successfully.');
        const user = await this.usersService.findOneByEmail(toMail);
        user.isEmailVerified = true;
        this.userRepository.save(user);
        return success;
      })
      .catch((err) => {
        console.log(err);
      });
  }
}

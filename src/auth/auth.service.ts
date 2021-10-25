import { Injectable } from '@nestjs/common';
import { JwtService } from '@nestjs/jwt';
import { MailService } from 'src/mail/mail.service';
import { User } from 'src/user/entities/user.entity';
import { UserService } from 'src/user/user.service';
import { RegisterUserDto } from './dto/auth.dto';

@Injectable()
export class AuthService {
  constructor(
    private usersService: UserService,
    private jwtService: JwtService,
    private mailsService: MailService,
  ) {}

  async validateUser(username: string, password: string): Promise<User | null> {
    const user = await this.usersService.validateUser(username, password);
    if (user) return user;
    return null;
  }

  async login(user: User): Promise<unknown> {
    const payload = { username: user.username, id: user.id };
    return {
      user: payload,
      access_token: this.jwtService.sign(payload),
    };
  }

  async register(registerUserDto: RegisterUserDto): Promise<User> {
    const newUser = await this.usersService.create(registerUserDto);
    // await this.mailsService.sendWelcomeEmail(registerUserDto.email);
    return newUser;
  }
}

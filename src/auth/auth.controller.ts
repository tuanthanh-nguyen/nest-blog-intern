import { Body, Controller, Get, Post, UseGuards } from '@nestjs/common';
import { User as GetUser } from 'src/common/decorators/user.decorator';
import { AuthService } from 'src/auth/auth.service';
import { LocalAuthGuard } from './guards/local-auth.guard';
import { JwtAuthGuard } from './guards/jwt-auth.guard';
import { RegisterUserDto } from './dto/auth.dto';
import { User } from 'src/user/entities/user.entity'

@Controller('auth')
export class AuthController {
  constructor(private readonly authService: AuthService) {}
  @Post('register')
  async register(@Body() registerUserDto: RegisterUserDto): Promise<User> {
    return this.authService.register(registerUserDto);
  }
  
  @UseGuards(LocalAuthGuard)
  @Post('login')
  async login(@GetUser() user: User): Promise<Object> {
    return this.authService.login(user);
  }

  @UseGuards(JwtAuthGuard)
  @Get('profile_test')
  async profile(@GetUser() user: User): Promise<User> {
    return user;
  }

}

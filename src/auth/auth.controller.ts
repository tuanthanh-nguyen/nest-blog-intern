import { Body, Controller, Get, Post, UseGuards } from '@nestjs/common';
import { User as GetUser } from 'src/common/decorators/user.decorator';
import { AuthService } from 'src/auth/auth.service';
import { LocalAuthGuard } from './guards/local-auth.guard';
import { JwtAuthGuard } from './guards/jwt-auth.guard';
import { LoginDto, RegisterUserDto } from './dto/auth.dto';
import { User } from 'src/user/entities/user.entity';
import {
  ApiBearerAuth,
  ApiBody,
  ApiCreatedResponse,
  ApiOkResponse,
  ApiOperation,
  ApiTags,
} from '@nestjs/swagger';

@ApiTags('auth')
@Controller('auth')
export class AuthController {
  constructor(private readonly authService: AuthService) {}

  @ApiOperation({ summary: 'register a user' })
  @ApiCreatedResponse({ description: 'user registered successfully' })
  @Post('register')
  async register(@Body() registerUserDto: RegisterUserDto): Promise<User> {
    return this.authService.register(registerUserDto);
  }

  @ApiOperation({ summary: 'login' })
  @ApiOkResponse({ description: 'user validated successfully' })
  @ApiBody({
    type: LoginDto,
  })
  @UseGuards(LocalAuthGuard)
  @Post('login')
  async login(@GetUser() user: User): Promise<unknown> {
    return this.authService.login(user);
  }

  @ApiBearerAuth('access_token')
  @ApiOperation({ summary: 'get user profile' })
  @ApiOkResponse({ description: 'profile fetched successfully' })
  @UseGuards(JwtAuthGuard)
  @Get('profile_test')
  async profile(@GetUser() user: User): Promise<User> {
    return user;
  }
}

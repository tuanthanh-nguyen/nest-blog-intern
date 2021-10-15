import { isString, IsString } from 'class-validator';

export class RegisterUserDto {
  @IsString()
  username: string;

  @IsString()
  password: string;

  @IsString()
  email: string;
}
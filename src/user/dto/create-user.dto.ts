import { IsString, IsEmail } from 'class-validator';

export class CreateUserDto {
  @IsString()
  username: string;

  @IsString()
  readonly password: string;

  @IsEmail()
  email: string;
}

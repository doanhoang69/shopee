import { IsEmail, IsEnum, IsNotEmpty, IsString } from 'class-validator';

export class LoginUser {
  @IsEmail()
  @IsNotEmpty()
  email: string;

  @IsString()
  @IsNotEmpty()
  password: string;
}

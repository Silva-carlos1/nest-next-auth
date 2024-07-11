import { IsEmail, IsInt, IsNotEmpty, IsString } from 'class-validator';

export class User {
  @IsNotEmpty()
  @IsInt()
  id: string;

  @IsNotEmpty()
  @IsString()
  name: string;

  @IsNotEmpty()
  @IsString()
  @IsEmail()
  email: string;

  @IsNotEmpty()
  @IsString()
  password?: string;
}

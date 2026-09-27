import { ApiProperty } from '@nestjs/swagger';
import { IsEmail, IsString, IsNotEmpty } from 'class-validator';

export class AuthenticateUserDto {
  @ApiProperty({ example: 'levi@lifehub.dev' })
  @IsEmail()
  email: string;

  @ApiProperty({ example: 'senha-bem-secreta' })
  @IsString()
  @IsNotEmpty()
  password: string;
}

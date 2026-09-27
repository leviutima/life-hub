import { ApiProperty } from '@nestjs/swagger';
import { IsEmail, IsString, MaxLength, MinLength } from 'class-validator';
import { Password } from '../../domain/value-objects/password.js';

export class RegisterUserDto {
  @ApiProperty({ example: 'Levi' })
  @IsString()
  @MinLength(2)
  @MaxLength(120)
  name: string;

  @ApiProperty({ example: 'levi@lifehub.dev' })
  @IsEmail()
  email: string;

  @ApiProperty({ example: 'senha-bem-secreta', minLength: Password.MIN_LENGTH })
  @IsString()
  @MinLength(Password.MIN_LENGTH)
  @MaxLength(Password.MAX_LENGTH)
  password: string;
}

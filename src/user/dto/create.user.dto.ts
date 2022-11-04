import { ApiProperty } from '@nestjs/swagger';
import {
  IsAlphanumeric,
  IsNotEmpty,
  MaxLength,
  MinLength,
} from 'class-validator';

export class CreateUserDto {
  @IsNotEmpty()
  @IsAlphanumeric()
  @MaxLength(32)
  @MinLength(2)
  @ApiProperty({
    example: 'name',
    description: 'User name',
  })
  readonly name: string;

}

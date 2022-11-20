import {
  IsAlphanumeric,
  IsNotEmpty,
  MaxLength,
  MinLength,
} from 'class-validator';
import { ApiProperty } from '@nestjs/swagger';

export class CheckUsernameDto {
  @IsNotEmpty()
  @ApiProperty({
    example: 'name',
    description: 'User name',
  })
  readonly name: string;
}

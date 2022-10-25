import {
  IsAlphanumeric,
  IsNotEmpty,
  MaxLength,
  MinLength,
} from 'class-validator';
import { ApiProperty } from '@nestjs/swagger';

export class CheckUsernameDto {
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

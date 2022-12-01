import { ApiProperty } from '@nestjs/swagger';
import {
  IsNotEmpty,
} from 'class-validator';

export class EditUserDto {
  @IsNotEmpty()
  @ApiProperty({
    example: 'name',
    description: 'User name',
  })
  readonly name: string;
}
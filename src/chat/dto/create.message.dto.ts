import { ApiProperty } from '@nestjs/swagger';
import { IsNotEmpty, MaxLength } from 'class-validator';

export class CreateMessageDto {
  @IsNotEmpty()
  @MaxLength(300)
  @ApiProperty({ example: 'Hello!', description: 'Message text' })
  readonly content: string;
}

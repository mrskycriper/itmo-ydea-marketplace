import { ApiProperty } from '@nestjs/swagger';
import { IsNotEmpty, IsNumberString, MaxLength } from 'class-validator';

export class ReceiveMessageDto {
  @IsNotEmpty()
  @MaxLength(300)
  readonly content: string;

  @IsNumberString()
  readonly chatId: number;

  @IsNotEmpty()
  readonly userId: string;
}

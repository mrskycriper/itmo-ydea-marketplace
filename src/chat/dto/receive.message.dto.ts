import { IsNotEmpty, IsNumberString, MaxLength } from 'class-validator';

export class ReceiveMessageDto {
  @IsNotEmpty()
  @MaxLength(300)
  readonly content: string;

  @IsNumberString()
  readonly chat_id: number;

  @IsNotEmpty()
  readonly user_id: string;
}

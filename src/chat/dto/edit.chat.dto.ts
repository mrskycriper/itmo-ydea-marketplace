import { ApiProperty } from '@nestjs/swagger';
import { IsNotEmpty, MaxLength, MinLength } from 'class-validator';

export class EditChatDto {
  @IsNotEmpty()
  @MaxLength(32)
  @MinLength(2)
  @ApiProperty({ example: 'Chat', description: 'Chat name' })
  readonly name: string;

  @MaxLength(300)
  @ApiProperty({
    example: 'Chat description',
    description: 'Chat description',
    required: false,
  })
  readonly description: string;
}

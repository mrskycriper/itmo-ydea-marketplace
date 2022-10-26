import { ApiProperty } from '@nestjs/swagger';

export class MessageEntity {
  @ApiProperty({ example: '3421', description: 'Unique message id' })
  id: number;

  @ApiProperty({ example: 'Hello!', description: 'Message text' })
  content: string;

  @ApiProperty({ example: '15 august 1984', description: 'Chat description' })
  created_at: Date;

  @ApiProperty({ example: '3421', description: 'Author id' })
  user_id: number;

  @ApiProperty({ example: '3421', description: 'Chat id' })
  chat_id: number;
}

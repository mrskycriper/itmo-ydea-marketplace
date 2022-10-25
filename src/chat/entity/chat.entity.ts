import { ApiProperty } from '@nestjs/swagger';

export class ChatEntity {
  @ApiProperty({ example: '3421', description: 'Unique chat id' })
  id: number;

  @ApiProperty({ example: 'Chat', description: 'Chat name' })
  name: string;

  @ApiProperty({
    example: 'Chat description',
    description: 'Chat description',
    required: false,
  })
  description: string;
}

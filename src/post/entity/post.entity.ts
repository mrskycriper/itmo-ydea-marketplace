import { ApiProperty } from '@nestjs/swagger';

export class PostEntity {
  @ApiProperty({ example: '3421', description: 'Unique post id' })
  id: number;

  @ApiProperty({
    example: '15 august 1984',
    description: 'When post was created',
  })
  createdAt: Date;

  @ApiProperty({ example: 'My first post here', description: 'Post title' })
  title: string;

  @ApiProperty({
    example: 'Hello OpenForum!',
    description: 'Post text content',
  })
  content: string;

  @ApiProperty({ example: '3421', description: 'Author id' })
  userId: number;

  @ApiProperty({
    example: '3421',
    description: 'Unique topic id this post is attached to',
  })
  topicId: number;
}

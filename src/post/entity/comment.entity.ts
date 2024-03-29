import { ApiProperty } from '@nestjs/swagger';

export class CommentEntity {
  @ApiProperty({ example: '3421', description: 'Unique comment id' })
  id: number;

  @ApiProperty({
    example: 'This post is awful',
    description: 'Comment text content',
  })
  content: string;

  @ApiProperty({
    example: '15 august 1984',
    description: 'When comment was created',
  })
  created_at: Date;

  @ApiProperty({ example: '3421', description: 'Author id' })
  user_id: number;

  @ApiProperty({
    example: '3421',
    description: 'Unique post id this comment is referring to',
  })
  post_id: number;
}

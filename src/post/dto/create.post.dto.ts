import { ApiProperty } from '@nestjs/swagger';
import { IsNotEmpty, IsNumber, MaxLength, MinLength } from 'class-validator';

export class CreatePostDto {
  @MaxLength(64)
  @MinLength(2)
  @ApiProperty({ example: 'My first post here', description: 'Post title' })
  readonly title: string;

  @MaxLength(1000)
  @ApiProperty({
    example: 'Hello OpenForum!',
    description: 'Post text content',
  })
  readonly content: string;

  @IsNotEmpty()
  @ApiProperty({
    example: 'c7a18e82-6741-4b29-bd58-26a84c5e2088',
    description: 'Author id',
  })
  readonly userId: string;

  @IsNumber()
  @ApiProperty({
    example: '3421',
    description: 'Unique topic id this post is attached to',
  })
  readonly topicId: number;
}

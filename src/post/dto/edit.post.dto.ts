import { ApiProperty } from '@nestjs/swagger';
import { MaxLength, MinLength } from 'class-validator';

export class EditPostDto {
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
}

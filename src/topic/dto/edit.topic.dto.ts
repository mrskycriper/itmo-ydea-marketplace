import { ApiProperty } from '@nestjs/swagger';
import { IsNotEmpty, MaxLength, MinLength } from 'class-validator';

export class EditTopicDto {
  @IsNotEmpty()
  @MaxLength(32)
  @MinLength(2)
  @ApiProperty({ example: 'Cake baking', description: 'Topic name' })
  readonly name: string;

  @MaxLength(300)
  @ApiProperty({
    example: 'Everything you need to know about cakes',
    description: 'Topic description',
    required: false,
  })
  readonly description: string;
}

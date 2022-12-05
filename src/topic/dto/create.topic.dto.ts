import { ApiProperty } from '@nestjs/swagger';
import {
  IsNotEmpty,
  IsNumber,
  IsNumberString,
  MaxLength,
  MinLength,
} from 'class-validator';

export class CreateTopicDto {
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

  @IsNumber()
  @ApiProperty({
    example: '3421',
    description: 'Unique category id this topic is attached to',
  })
  readonly category_id: number;
}

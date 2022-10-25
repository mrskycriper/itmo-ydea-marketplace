import { ApiProperty } from '@nestjs/swagger';
import { IsNotEmpty, MaxLength, MinLength } from 'class-validator';

export class CreateCategoryDto {
  @IsNotEmpty()
  @MaxLength(32)
  @MinLength(2)
  @ApiProperty({ example: 'Cooking', description: 'Category name' })
  readonly name: string;

  @MaxLength(300)
  @ApiProperty({
    example: 'Everything about food',
    description: 'Category description',
    required: false,
  })
  readonly description: string;
}

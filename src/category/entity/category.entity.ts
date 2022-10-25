import { ApiProperty } from '@nestjs/swagger';

export class CategoryEntity {
  @ApiProperty({ example: '3421', description: 'Unique category id' })
  id: number;

  @ApiProperty({ example: 'Cooking', description: 'Category name' })
  name: string;

  @ApiProperty({
    example: 'Everything about food',
    description: 'Category description',
    required: false,
  })
  description: string;
}

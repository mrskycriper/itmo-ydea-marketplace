import { ApiProperty } from '@nestjs/swagger';
import { IsNotEmpty, IsUUID } from 'class-validator';

export class EditProductCategoryDto {
  @IsNotEmpty()
  @ApiProperty({
    example: 'Chairs',
    description: 'Category name',
  })
  readonly category: string;
}

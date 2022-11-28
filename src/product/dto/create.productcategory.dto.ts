import { ApiProperty } from '@nestjs/swagger';
import { IsNotEmpty, IsNumber, IsUrl } from 'class-validator';

export class CreateProductCategoryDto {
  @IsNotEmpty()
  @ApiProperty({
    example: 'Chairs',
    description: 'Category name',
  })
  readonly category: string;
}

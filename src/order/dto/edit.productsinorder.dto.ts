import { ApiProperty } from '@nestjs/swagger';
import { IsNotEmpty } from 'class-validator';

export class EditProductsInOrderDto {
  @IsNotEmpty()
  @ApiProperty({
    example: 10,
    description: 'Quantity of the product',
  })
  readonly number: number;
}

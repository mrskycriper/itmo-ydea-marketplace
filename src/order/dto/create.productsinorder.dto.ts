import { ApiProperty } from '@nestjs/swagger';
import { IsAlphanumeric, IsNotEmpty } from 'class-validator';

export class CreateProductsInOrderDto {
  @IsNotEmpty()
  @ApiProperty({
    example: 10,
    description: 'Quantity of the product',
  })
  readonly number: number;

  @IsNotEmpty()
  @ApiProperty({
    example: 15,
    description: 'Product id',
  })
  readonly product_id: number;

  @IsNotEmpty()
  @ApiProperty({
    example: 7,
    description: 'Order id',
  })
  readonly order_id: number;
}

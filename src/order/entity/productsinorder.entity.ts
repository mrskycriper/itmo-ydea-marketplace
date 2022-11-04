import { ApiProperty } from '@nestjs/swagger';

export class CreateProductsInOrderDto {
  @ApiProperty({
    example: 'c7a18e82-6741-4b29-bd58-26a84c5e2088',
    description: 'Unique productsInOrder id',
  })
  readonly id: string;

  @ApiProperty({
    example: '10',
    description: 'Quantity of the product',
  })
  readonly number: number;

  @ApiProperty({
    example: 'c7a18e82-6741-4b29-bd58-26a84c5e2088',
    description: 'Product id',
  })
  readonly productId: string;

  @ApiProperty({
    example: 'c7a18e82-6741-4b29-bd58-26a84c5e2088',
    description: 'Order id',
  })
  readonly orderId: string;
}

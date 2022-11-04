import { ApiProperty } from '@nestjs/swagger';
import { IsAlphanumeric, IsNotEmpty } from 'class-validator';

export class CreateProductsInOrderDto {
  @IsNotEmpty()
  @ApiProperty({
    example: 'c7a18e82-6741-4b29-bd58-26a84c5e2088',
    description: 'Unique productsInOrder id',
  })
  readonly id: string;

  @IsNotEmpty()
  @IsAlphanumeric()
  @ApiProperty({
    example: '10',
    description: 'Quantity of the product',
  })
  readonly number: number;

  @IsNotEmpty()
  @ApiProperty({
    example: 'c7a18e82-6741-4b29-bd58-26a84c5e2088',
    description: 'Product id',
  })
  readonly productId: string;

  @IsNotEmpty()
  @ApiProperty({
    example: 'c7a18e82-6741-4b29-bd58-26a84c5e2088',
    description: 'Order id',
  })
  readonly orderId: string;
}

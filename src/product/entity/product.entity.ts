import { ApiProperty } from '@nestjs/swagger';

export class ProductEntity {
  @ApiProperty({
    example: 'c7a18e82-6741-4b29-bd58-26a84c5e2088',
    description: 'Unique product id',
  })
  readonly id: string;

  /* 
    @ApiProperty({
      example: 'name',
      description: 'Product name',
    })
    readonly name: string; */

  @ApiProperty({
    example: '100',
    description: 'Product price',
  })
  readonly price: number;

  @ApiProperty({
    example: '10',
    description: 'Product quantity',
  })
  readonly number: number;

  @ApiProperty({
    example: 'c7a18e82-6741-4b29-bd58-26a84c5e2088',
    description: 'Seller id',
  })
  readonly sellerId: string;
}

import { ApiProperty } from '@nestjs/swagger';

export class ReviewEntity {
  @ApiProperty({
    example: 'c7a18e82-6741-4b29-bd58-26a84c5e2088',
    description: 'Unique review id',
  })
  readonly id: string;

  @ApiProperty({
    example: 'review text',
    description: 'Text of the review',
  })
  readonly text: string;

  @ApiProperty({
    example: '5',
    description: 'Review rating',
  })
  readonly rating: number;

  @ApiProperty({
    example: '10',
    description: 'Product quantity',
  })
  readonly number: number;

  @ApiProperty({
    example: 'c7a18e82-6741-4b29-bd58-26a84c5e2088',
    description: 'User id',
  })
  readonly userId: string;

  @ApiProperty({
    example: 'c7a18e82-6741-4b29-bd58-26a84c5e2088',
    description: 'Product id',
  })
  readonly productId: string;
}

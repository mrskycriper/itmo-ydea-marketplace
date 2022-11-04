import { ApiProperty } from '@nestjs/swagger';

export class SellerEntity {
  @ApiProperty({
    example: '12',
    description: 'Unique seller id',
  })
  readonly id: number;

  @ApiProperty({
    example: 'description',
    description: 'Description of the seller',
  })
  readonly description: string;

  @ApiProperty({
    example: 'c7a18e82-6741-4b29-bd58-26a84c5e2088',
    description: 'User id',
  })
  readonly userId: string;
}

import { ApiProperty } from '@nestjs/swagger';

export class OrderEntity {
  @ApiProperty({
    example: 'c7a18e82-6741-4b29-bd58-26a84c5e2088',
    description: 'Unique order id',
  })
  readonly id: string;

  @ApiProperty({
    example: '01.10.2022',
    description: 'Date of order creation',
  })
  readonly start_tmestamp: Date;

  @ApiProperty({
    example: 'c7a18e82-6741-4b29-bd58-26a84c5e2088',
    description: 'User id',
  })
  readonly userId: string;
}

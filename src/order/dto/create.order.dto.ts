import { ApiProperty } from '@nestjs/swagger';
import { IsNotEmpty } from 'class-validator';

export class CreateOrderDto {
  @IsNotEmpty()
  @ApiProperty({
    example: '01.10.2022',
    description: 'Date of order creation',
  })
  readonly start_timestamp: Date;

  @IsNotEmpty()
  @ApiProperty({
    example: 'c7a18e82-6741-4b29-bd58-26a84c5e2088',
    description: 'User id',
  })
  readonly user_id: string;
}

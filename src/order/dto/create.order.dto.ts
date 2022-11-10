import { ApiProperty } from '@nestjs/swagger';
import { IsNotEmpty } from 'class-validator';

export class CreateOrderDto {
  @IsNotEmpty()
  @ApiProperty({
    example: '2022-11-07T11:05:06',
    description: 'Date of order creation',
  })
  readonly start_timestamp: Date;

  @IsNotEmpty()
  @ApiProperty({
    example: 'c7a18e82-6741-4b29-bd58-26a84c5e2088',
    description: 'User id',
  })
  readonly user_id: string;

  constructor(timestamp : Date, user : string){
    this.start_timestamp = timestamp;
    this.user_id = user;
  }
}

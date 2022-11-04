import { ApiProperty } from '@nestjs/swagger';
import {
  IsAlphanumeric,
  IsNotEmpty,
  MaxLength,
  MinLength,
} from 'class-validator';

export class CreateSellerDto {
  @IsNotEmpty()
  @ApiProperty({
    example: '12',
    description: 'Unique seller id',
  })
  readonly id: number;

  @IsAlphanumeric()
  @MaxLength(500)
  @MinLength(10)
  @ApiProperty({
    example: 'description',
    description: 'Description of the seller',
  })
  readonly description: string;

  @IsNotEmpty()
  @ApiProperty({
    example: 'c7a18e82-6741-4b29-bd58-26a84c5e2088',
    description: 'User id',
  })
  readonly userId: string;
}

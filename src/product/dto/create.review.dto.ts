import { ApiProperty } from '@nestjs/swagger';
import {
  IsAlphanumeric,
  IsNotEmpty,
  MaxLength,
  MinLength,
  Min,
  Max,
} from 'class-validator';

export class CreateReviewDto {
  @IsNotEmpty()
  @ApiProperty({
    example: 'c7a18e82-6741-4b29-bd58-26a84c5e2088',
    description: 'Unique review id',
  })
  readonly id: string;

  @IsAlphanumeric()
  @MaxLength(500)
  @MinLength(3)
  @ApiProperty({
    example: 'review text',
    description: 'Text of the review',
  })
  readonly text: string;

  @IsNotEmpty()
  @IsAlphanumeric()
  @Min(0)
  @Max(5)
  @ApiProperty({
    example: '5',
    description: 'Review rating',
  })
  readonly rating: number;

  @IsNotEmpty()
  @IsAlphanumeric()
  @ApiProperty({
    example: '10',
    description: 'Product quantity',
  })
  readonly number: number;

  @IsNotEmpty()
  @ApiProperty({
    example: 'c7a18e82-6741-4b29-bd58-26a84c5e2088',
    description: 'User id',
  })
  readonly user_id: string;

  @IsNotEmpty()
  @ApiProperty({
    example: 'c7a18e82-6741-4b29-bd58-26a84c5e2088',
    description: 'Product id',
  })
  readonly product_id: number;
}

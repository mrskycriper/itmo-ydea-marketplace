import { ApiProperty } from '@nestjs/swagger';
import { IsNotEmpty, Min, Max, IsNumber } from 'class-validator';

export class CreateReviewDto {
  @ApiProperty({
    example: 'Review text',
    description: 'Text of the review',
  })
  readonly text: string;

  @IsNotEmpty()
  @IsNumber()
  @Min(0)
  @Max(5)
  @ApiProperty({
    example: 4,
    description: 'Review rating',
  })
  readonly rating: number;

  @IsNotEmpty()
  @ApiProperty({
    example: 'c7a18e82-6741-4b29-bd58-26a84c5e2088',
    description: 'User id',
  })
  readonly user_id: string;

  @IsNotEmpty()
  @IsNumber()
  @ApiProperty({
    example: 11,
    description: 'Product id',
  })
  readonly product_id: number;
}

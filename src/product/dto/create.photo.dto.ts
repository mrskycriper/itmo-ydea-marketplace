import { ApiProperty } from '@nestjs/swagger';
import {
  IsAlphanumeric,
  IsNotEmpty,
  MaxLength,
  MinLength,
} from 'class-validator';

export class CreatePhotoDto {
  @IsNotEmpty()
  @ApiProperty({
    example: 'c7a18e82-6741-4b29-bd58-26a84c5e2088',
    description: 'Unique review id',
  })
  readonly id: string;

  @IsAlphanumeric()
  @MaxLength(50)
  @MinLength(15)
  @ApiProperty({
    example: 'https://smthsmth.com',
    description: 'Link to the photo',
  })
  readonly photo_url: string;

  @IsNotEmpty()
  @ApiProperty({
    example: 'c7a18e82-6741-4b29-bd58-26a84c5e2088',
    description: 'Product id',
  })
  readonly product_id: number;
}

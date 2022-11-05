import { ApiProperty } from '@nestjs/swagger';
import {
  IsAlphanumeric,
  IsNotEmpty,
  IsUrl,
  MaxLength,
  MinLength,
} from 'class-validator';

export class CreatePhotoDto {
  @IsNotEmpty()
  @IsUrl()
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

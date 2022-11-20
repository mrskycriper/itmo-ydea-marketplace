import { ApiProperty } from '@nestjs/swagger';
import { IsNotEmpty, IsNumber, IsUrl } from 'class-validator';

export class CreatePhotoDto {
  @IsNotEmpty()
  @IsUrl()
  @ApiProperty({
    example: 'https://smthsmth.com',
    description: 'Link to the photo',
  })
  readonly photo_url: string;

  @IsNotEmpty()
  @IsNumber()
  @ApiProperty({
    example: 132,
    description: 'Product id',
  })
  readonly product_id: number;
}

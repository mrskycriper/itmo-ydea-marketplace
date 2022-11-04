import { ApiProperty } from '@nestjs/swagger';

export class PhotoEntity {
  @ApiProperty({
    example: 'c7a18e82-6741-4b29-bd58-26a84c5e2088',
    description: 'Unique review id',
  })
  readonly id: string;

  @ApiProperty({
    example: 'https://smthsmth.com',
    description: 'Link to the photo',
  })
  readonly photo_url: string;

  @ApiProperty({
    example: 'c7a18e82-6741-4b29-bd58-26a84c5e2088',
    description: 'Product id',
  })
  readonly productId: string;
}

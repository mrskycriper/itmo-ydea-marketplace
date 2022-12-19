import { ApiProperty } from '@nestjs/swagger';
import { IsNotEmpty, IsNumber, IsUUID, Min } from 'class-validator';

export class CreateProductDto {
  @IsNotEmpty()
  @ApiProperty({
    example: 'name',
    description: 'Product name',
  })
  readonly name: string;

  @IsNotEmpty()
  @ApiProperty({
    example: 'name',
    description: 'Product description',
  })
  readonly description: string;

  @IsNotEmpty()
  @IsNumber()
  @Min(1)
  @ApiProperty({
    example: '100',
    description: 'Product price',
  })
  readonly price: number;

  @IsNotEmpty()
  @IsNumber()
  @Min(1)
  @ApiProperty({
    example: '10',
    description: 'Product quantity',
  })
  readonly number: number;

  @IsNotEmpty()
  @IsUUID()
  @ApiProperty({
    example: '1d98dc2b-3dc8-4a71-a2f0-9312bdf07317',
    description: 'Product category',
  })
  readonly category_id: string;

  @IsNotEmpty()
  @IsNumber()
  @ApiProperty({
    example: '4005',
    description: 'Seller id',
  })
  readonly seller_id: number;
}

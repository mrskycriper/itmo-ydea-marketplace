import { ApiProperty } from '@nestjs/swagger';
import {
  IsAlphanumeric,
  IsNotEmpty,
  MaxLength,
  MinLength,
} from 'class-validator';

export class CreateProductDto {
  /* @IsNotEmpty()
   @IsAlphanumeric()
   @MaxLength(32)
   @MinLength(2)
   @ApiProperty({
     example: 'name',
     description: 'Product name',
   })
   readonly name: string; */

  @IsNotEmpty()
  @ApiProperty({
    example: '100',
    description: 'Product price',
  })
  readonly price: number;

  @IsNotEmpty()
  @ApiProperty({
    example: '10',
    description: 'Product quantity',
  })
  readonly number: number;

  @IsNotEmpty()
  @ApiProperty({
    example: '4005',
    description: 'Seller id',
  })
  readonly seller_id: number;
}

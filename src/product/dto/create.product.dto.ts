import { ApiProperty } from '@nestjs/swagger';
import {
  IsAlphanumeric,
  IsNotEmpty,
  MaxLength,
  MinLength,
} from 'class-validator';

export class CreateProductDto {
    @IsNotEmpty()
    @ApiProperty({
      example: '12',
      description: 'Unique product id',
    })
    readonly id: number;

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
    @IsAlphanumeric()
    @ApiProperty({
      example: '100',
      description: 'Product price',
    })
    readonly price: number;

    @IsNotEmpty()
    @IsAlphanumeric()
    @ApiProperty({
        example: '10',
        description: 'Product quantity',
      })
    readonly number: number
    
    @IsNotEmpty()
    @ApiProperty({
        example: 'c7a18e82-6741-4b29-bd58-26a84c5e2088',
        description: 'Seller id',
     })
    readonly sellerId: string;



  }
  
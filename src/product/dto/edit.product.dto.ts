import { ApiProperty } from '@nestjs/swagger';
import {
  IsAlphanumeric,
  IsNotEmpty,
  MaxLength,
  MinLength,
} from 'class-validator';

export class EditProductDto {
  @IsNotEmpty()
  @ApiProperty({
    example: 'name',
    description: 'Product name',
  })
  readonly name: string;

  @IsNotEmpty()
  @ApiProperty({
    example: 'description',
    description: 'Product description',
  })
  readonly description: string;

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
}

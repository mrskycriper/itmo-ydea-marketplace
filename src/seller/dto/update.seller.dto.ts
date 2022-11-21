import { ApiProperty } from '@nestjs/swagger';
import { IsNotEmpty } from 'class-validator';

export class UpdateSellerDto {
  @IsNotEmpty()
  @ApiProperty({
    example: 'description',
    description: 'Description of the seller',
  })
  readonly description: string;
}

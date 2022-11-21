import { ApiProperty } from '@nestjs/swagger';
import { IsNotEmpty } from 'class-validator';

export class SetAddressDto {
  @IsNotEmpty()
  @ApiProperty({
    example: 'City, Street, h. 12, app. 10',
    description: 'Delivery address',
  })
  readonly address: string;
}
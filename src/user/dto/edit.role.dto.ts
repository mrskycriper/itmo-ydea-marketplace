import { IsBoolean } from 'class-validator';
import { ApiProperty } from '@nestjs/swagger';

export class EditRoleDto {
  @IsBoolean()
  @ApiProperty({
    example: 'true',
    description: 'If user is Moderator',
  })
  readonly is_moderator: boolean;

  @IsBoolean()
  @ApiProperty({
    example: 'true',
    description: 'If user is Admin',
  })
  readonly is_admin: boolean;

  @IsBoolean()
  @ApiProperty({
    example: 'true',
    description: 'If user is Support',
  })
  readonly is_support: boolean;

  @IsBoolean()
  @ApiProperty({
    example: 'true',
    description: 'If user is Seller',
  })
  readonly is_seller: boolean;
}

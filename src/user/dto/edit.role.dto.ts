import { IsBoolean } from 'class-validator';
import { ApiProperty } from '@nestjs/swagger';

export class EditRoleDto {
  @IsBoolean()
  @ApiProperty({
    example: 'true',
    description: 'If user is Moderator',
  })
  readonly isModerator: boolean;

  @IsBoolean()
  @ApiProperty({
    example: 'true',
    description: 'If user is Admin',
  })
  readonly isAdmin: boolean;
}

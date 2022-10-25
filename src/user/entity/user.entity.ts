import { ApiProperty } from '@nestjs/swagger';

export class UserEntity {
  @ApiProperty({
    example: 'c7a18e82-6741-4b29-bd58-26a84c5e2088',
    description: 'Users unique id',
  })
  id: string;

  @ApiProperty({
    example: 'User123',
    description: 'Unique username',
  })
  name: string;

  @ApiProperty({
    example: 'false',
    description: 'Defines if user has a moderator role',
  })
  isModerator: boolean;

  @ApiProperty({
    example: 'false',
    description: 'Defines if user has an admin role',
  })
  isAdmin: boolean;
}

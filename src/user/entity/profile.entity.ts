import { ApiProperty } from '@nestjs/swagger';

export class ProfileEntity {
  @ApiProperty({ example: '3421', description: 'Profile unique id' })
  id: number;

  @ApiProperty({ example: "I'm a teapot", description: 'Users biography' })
  bio: string;

  @ApiProperty({
    example: 'c7a18e82-6741-4b29-bd58-26a84c5e2088',
    description: 'Profile owners id',
  })
  userId: string;
}

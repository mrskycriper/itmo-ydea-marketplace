import { ApiProperty } from '@nestjs/swagger';
import { IsNotEmpty, MaxLength, MinLength } from 'class-validator';

export class CreateChatDto {
  @IsNotEmpty()
  @MaxLength(32)
  @MinLength(2)
  @ApiProperty({ example: 'Super chat', description: 'Chat name' })
  readonly name: string;

  @MaxLength(300)
  @ApiProperty({
    example: 'This chat is super',
    description: 'Chat description',
    required: false,
  })
  readonly description: string;

  constructor(name: string, description: string){
    this.name = name;
    this.description = description;
  }
}

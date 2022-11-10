import { ApiProperty } from '@nestjs/swagger';
import { IsNotEmpty } from 'class-validator';

export class SetTimeSlotDto {
  @IsNotEmpty()
  @ApiProperty({
    example: '2022-11-07T11:05:06',
    description: 'Start of the delivery time slot.',
  })
  readonly timeslot_start: Date;

  @IsNotEmpty()
  @ApiProperty({
    example: '2022-11-07T14:05:06',
    description: 'End of the delivery time slot.',
  })
  readonly timeslot_end: Date;

  constructor(start: Date, end: Date){
    this.timeslot_start = start;
    this.timeslot_end = end;
  }
}
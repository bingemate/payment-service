import { ApiProperty } from '@nestjs/swagger';

export class CreateSubscriptionDto {
  @ApiProperty()
  userId: string;
  @ApiProperty({ required: false })
  cancelAt?: number;
}

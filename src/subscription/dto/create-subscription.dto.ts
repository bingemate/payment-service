import { ApiProperty } from '@nestjs/swagger';

export class CreateSubscriptionDto {
  @ApiProperty()
  customerId: string;
  @ApiProperty({ required: false })
  cancelAt?: number;
}

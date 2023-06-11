import { ApiProperty } from '@nestjs/swagger';

export class SubscriptionDto {
  @ApiProperty()
  isCanceled: boolean;
  @ApiProperty()
  status: string;
  @ApiProperty()
  price: number;
  @ApiProperty()
  paymentMethod: string;
  @ApiProperty()
  startedAt: number;
  @ApiProperty()
  nextPaymentAt: number;
  @ApiProperty()
  endAt: number;
}

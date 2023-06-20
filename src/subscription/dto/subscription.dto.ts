import { ApiProperty } from '@nestjs/swagger';
import { DiscountDto } from './discount.dto';

export class SubscriptionDto {
  @ApiProperty()
  isCanceled: boolean;
  @ApiProperty()
  status: string;
  @ApiProperty()
  price: number;
  @ApiProperty()
  startedAt: number;
  @ApiProperty()
  nextPaymentAt: number;
  @ApiProperty()
  endAt: number;
  @ApiProperty({ type: DiscountDto })
  discount: DiscountDto;
}

import { Module } from '@nestjs/common';
import StripeService from './stripe.service';

@Module({
  providers: [StripeService],
  exports: [StripeService],
  controllers: [],
})
export class StripeModule {}

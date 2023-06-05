import { Module } from '@nestjs/common';
import SubscriptionService from './subscription.service';
import { SubscriptionController } from './subscription.controller';
import { HttpModule } from '@nestjs/axios';
import { CustomerModule } from '../customer/customer.module';
import { StripeModule } from '../stripe/stripe.module';

@Module({
  imports: [HttpModule, CustomerModule, StripeModule],
  providers: [SubscriptionService],
  exports: [SubscriptionService],
  controllers: [SubscriptionController],
})
export class SubscriptionModule {}

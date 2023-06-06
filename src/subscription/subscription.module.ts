import { Module } from '@nestjs/common';
import SubscriptionService from './subscription.service';
import { SubscriptionController } from './subscription.controller';
import { HttpModule } from '@nestjs/axios';
import { CustomerModule } from '../customer/customer.module';
import { StripeModule } from '../stripe/stripe.module';
import { TypeOrmModule } from '@nestjs/typeorm';
import { SubscriptionEntity } from './subscription.entity';
import { UserModule } from '../user/user.module';

@Module({
  imports: [
    HttpModule,
    CustomerModule,
    UserModule,
    StripeModule,
    TypeOrmModule.forFeature([SubscriptionEntity]),
  ],
  providers: [SubscriptionService],
  exports: [SubscriptionService],
  controllers: [SubscriptionController],
})
export class SubscriptionModule {}

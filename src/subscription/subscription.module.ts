import { Module } from '@nestjs/common';
import SubscriptionService from './subscription.service';
import { SubscriptionController } from './subscription.controller';
import { HttpModule } from '@nestjs/axios';
import { SubscriptionEntity } from './subscription.entity';
import { TypeOrmModule } from '@nestjs/typeorm';
import { PaymentModule } from '../payment/payment.module';

@Module({
  imports: [
    TypeOrmModule.forFeature([SubscriptionEntity]),
    HttpModule,
    PaymentModule,
  ],
  providers: [SubscriptionService],
  exports: [SubscriptionService],
  controllers: [SubscriptionController],
})
export class SubscriptionModule {}

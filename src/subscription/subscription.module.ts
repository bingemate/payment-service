import { Module } from '@nestjs/common';
import SubscriptionService from './subscription.service';
import { SubscriptionController } from './subscription.controller';
import { HttpModule } from '@nestjs/axios';
import { SubscriptionEntity } from './subscription.entity';
import { TypeOrmModule } from '@nestjs/typeorm';

@Module({
  imports: [TypeOrmModule.forFeature([SubscriptionEntity]), HttpModule],
  providers: [SubscriptionService],
  exports: [SubscriptionService],
  controllers: [SubscriptionController],
})
export class SubscriptionModule {}

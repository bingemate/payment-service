import { Module } from '@nestjs/common';
import PaymentService from './payment.service';
import { PaymentController } from './payment.controller';
import { CustomerModule } from '../customer/customer.module';

@Module({
  imports: [CustomerModule],
  providers: [PaymentService],
  exports: [PaymentService],
  controllers: [PaymentController],
})
export class PaymentModule {}

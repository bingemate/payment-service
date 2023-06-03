import { Module } from '@nestjs/common';
import PaymentService from './payment.service';
import { PaymentController } from './payment.controller';

@Module({
  imports: [PaymentService],
  providers: [],
  exports: [PaymentService],
  controllers: [PaymentController],
})
export class PaymentModule {}

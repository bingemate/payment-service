import { Module } from '@nestjs/common';
import { StripeModule } from '../stripe/stripe.module';
import { InvoiceController } from './invoice.controller';
import { CustomerModule } from '../customer/customer.module';

@Module({
  imports: [StripeModule, CustomerModule],
  controllers: [InvoiceController],
})
export class InvoiceModule {}

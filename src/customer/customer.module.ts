import { Module } from '@nestjs/common';
import { CustomerEntity } from './customer.entity';
import { TypeOrmModule } from '@nestjs/typeorm';
import CustomerService from './customer.service';
import { CustomerController } from './customer.controller';
import { StripeModule } from '../stripe/stripe.module';

@Module({
  imports: [TypeOrmModule.forFeature([CustomerEntity]), StripeModule],
  providers: [CustomerService],
  exports: [CustomerService],
  controllers: [CustomerController],
})
export class CustomerModule {}

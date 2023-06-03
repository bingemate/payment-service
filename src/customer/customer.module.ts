import { Module } from '@nestjs/common';
import { CustomerEntity } from './customer.entity';
import { TypeOrmModule } from '@nestjs/typeorm';
import CustomerService from './customer.service';

@Module({
  imports: [TypeOrmModule.forFeature([CustomerEntity])],
  providers: [CustomerService],
  exports: [CustomerService],
  controllers: [],
})
export class CustomerModule {}

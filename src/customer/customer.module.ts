import { Module } from '@nestjs/common';
import { CustomerEntity } from './customer.entity';
import { TypeOrmModule } from '@nestjs/typeorm';

@Module({
  imports: [TypeOrmModule.forFeature([CustomerEntity])],
  providers: [],
  exports: [],
  controllers: [],
})
export class CustomerModule {}

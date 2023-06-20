import { Injectable } from '@nestjs/common';
import { CustomerEntity } from './customer.entity';
import { Repository } from 'typeorm';
import { InjectRepository } from '@nestjs/typeorm';

@Injectable()
export default class CustomerService {
  constructor(
    @InjectRepository(CustomerEntity)
    private readonly customerRepository: Repository<CustomerEntity>,
  ) {}

  async getByUserId(userId: string) {
    return await this.customerRepository.findOneBy({ userId });
  }

  async saveCustomer(userId: string, customerId: string) {
    return await this.customerRepository.save({ userId, customerId });
  }

  async getBySubId(subscriptionId: any) {
    return await this.customerRepository.findOneBy({
      subscriptions: { id: subscriptionId },
    });
  }
}

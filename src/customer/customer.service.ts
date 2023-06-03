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

  async getById(userId: string) {
    return await this.customerRepository.findOneBy({ userId });
  }

  async createCustomer(userId: string, customerId: string) {
    return await this.customerRepository.create({ userId, customerId });
  }
}

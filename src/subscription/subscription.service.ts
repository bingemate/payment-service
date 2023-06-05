import { Injectable } from '@nestjs/common';
import { HttpService } from '@nestjs/axios';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { SubscriptionEntity } from './subscription.entity';
import { CustomerEntity } from '../customer/customer.entity';

@Injectable()
export default class SubscriptionService {
  constructor(
    private readonly httpService: HttpService,
    @InjectRepository(SubscriptionEntity)
    private readonly subscriptionRepository: Repository<SubscriptionEntity>,
  ) {}

  async getSubscriptionByUserId(userId: string) {
    return await this.subscriptionRepository.findOneBy({
      customer: { userId },
    });
  }

  async createSubscription(id: string, customer: CustomerEntity) {
    return await this.subscriptionRepository.save({
      id,
      customer,
    });
  }

  async deleteSubscription(id: string) {
    await this.subscriptionRepository.delete(id);
  }
}

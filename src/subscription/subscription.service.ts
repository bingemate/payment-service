import { Injectable } from '@nestjs/common';
import { HttpService } from '@nestjs/axios';
import { SubscriptionEntity } from './subscription.entity';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';

@Injectable()
export default class SubscriptionService {
  constructor(
    private readonly httpService: HttpService,
    @InjectRepository(SubscriptionEntity)
    private readonly mediaHistoryRepository: Repository<SubscriptionEntity>,
  ) {}

  async userSubscribed(userId: string, subscriptionId: string) {
    this.httpService.put(
      `${process.env.KEYCLOAK_SERVICE_URL}/user-admin/roles/${userId}`,
      {
        role: 'bingemate-subscribed',
      },
    );
    this.mediaHistoryRepository.create({ userId, subscriptionId });
  }

  async userUnsubscribed(userId: string, subscriptionId: string) {
    this.httpService.delete(
      `${process.env.KEYCLOAK_SERVICE_URL}/user-admin/roles/${userId}`,
      {
        data: {
          role: 'bingemate-subscribed',
        },
      },
    );
    this.mediaHistoryRepository.create({ userId, subscriptionId });
  }
}

import { Injectable } from '@nestjs/common';
import { HttpService } from '@nestjs/axios';
import CustomerService from '../customer/customer.service';

@Injectable()
export default class SubscriptionService {
  constructor(
    private readonly httpService: HttpService,
    private customerService: CustomerService,
  ) {}

  async userSubscribed(userId: string, customerId: string) {
    await this.customerService.createCustomer(userId, customerId);
    this.httpService.put(
      `${process.env.KEYCLOAK_SERVICE_URL}/user-admin/roles/${userId}`,
      {
        role: 'bingemate-subscribed',
      },
    );
  }

  async userUnsubscribed(userId: string) {
    this.httpService.delete(
      `${process.env.KEYCLOAK_SERVICE_URL}/user-admin/roles/${userId}`,
      {
        data: {
          role: 'bingemate-subscribed',
        },
      },
    );
  }
}

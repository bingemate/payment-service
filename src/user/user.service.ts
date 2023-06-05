import { Injectable } from '@nestjs/common';
import { HttpService } from '@nestjs/axios';

@Injectable()
export default class UserService {
  constructor(private readonly httpService: HttpService) {}

  async userSubscribed(userId: string) {
    this.httpService.put(
      `${process.env.KEYCLOAK_SERVICE_URL}/user-admin/roles/${userId}`,
      {
        role: 'bingemate-subscribed',
      },
    );
  }

  userUnsubscribed(userId: string) {
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
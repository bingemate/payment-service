import { Injectable } from '@nestjs/common';
import { HttpService } from '@nestjs/axios';

@Injectable()
export default class UserService {
  constructor(private readonly httpService: HttpService) {}

  userSubscribed(userId: string) {
    return this.httpService.put(
      `${process.env.KEYCLOAK_SERVICE_URL}/user-admin/roles/${userId}`,
      {
        role: 'bingemate-subscribed',
      },
    );
  }

  userUnsubscribed(userId: string) {
    return this.httpService.delete(
      `${process.env.KEYCLOAK_SERVICE_URL}/user-admin/roles/${userId}`,
      {
        data: {
          role: 'bingemate-subscribed',
        },
      },
    );
  }
}

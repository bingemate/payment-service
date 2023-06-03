import {
  BadRequestException,
  Body,
  Controller,
  Headers,
  HttpCode,
  Post,
  RawBodyRequest,
  Req,
} from '@nestjs/common';
import { ApiOkResponse, ApiTags } from '@nestjs/swagger';
import PaymentService from '../payment/payment.service';
import SubscriptionService from './subscription.service';

@ApiTags('/subscription')
@Controller({ path: '/subscription' })
export class SubscriptionController {
  constructor(
    private paymentService: PaymentService,
    private subscriptionService: SubscriptionService,
  ) {}

  @ApiOkResponse()
  @HttpCode(200)
  @Post('/created')
  async createdSubscription(
    @Headers() headers,
    @Req() request: RawBodyRequest<Request>,
  ) {
    try {
      const sig = headers['stripe-signature'];
      const event = this.paymentService.constructEvent(
        request.rawBody,
        sig,
        process.env.STRIPE_CREATED_SUB_KEY,
      );
      this.subscriptionService.userSubscribed(
        event.data.object['client_reference_id'],
        event.data.object['customer'],
      );
    } catch (err) {
      throw new BadRequestException(`Webhook Error: ${err.message}`);
    }
  }

  @ApiOkResponse()
  @HttpCode(200)
  @Post('/canceled')
  async canceledSubscription(@Headers() headers, @Body() body: string) {
    try {
      const sig = headers['stripe-signature'];
      const event = this.paymentService.constructEvent(
        body,
        sig,
        process.env.STRIPE_CANCELED_SUB_KEY,
      );
      this.subscriptionService.userUnsubscribed(
        event.data.object['client_reference_id'],
      );
    } catch (err) {
      throw new BadRequestException(`Webhook Error: ${err.message}`);
    }
  }
}

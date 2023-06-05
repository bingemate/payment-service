import {
  BadRequestException,
  Body,
  Controller,
  Get,
  Headers,
  HttpCode,
  Post,
  RawBodyRequest,
  Req,
} from '@nestjs/common';
import {
  ApiBadRequestResponse,
  ApiOkResponse,
  ApiOperation,
  ApiTags,
} from '@nestjs/swagger';
import SubscriptionService from './subscription.service';
import StripeService from '../stripe/stripe.service';
import CustomerService from '../customer/customer.service';

@ApiTags('/subscription')
@Controller({ path: '/subscription' })
export class SubscriptionController {
  constructor(
    private subscriptionService: SubscriptionService,
    private customerService: CustomerService,
    private stripeService: StripeService,
  ) {}

  @ApiOkResponse()
  @HttpCode(200)
  @Post('created')
  async createdSubscription(
    @Headers() headers,
    @Req() request: RawBodyRequest<Request>,
  ) {
    try {
      const sig = headers['stripe-signature'];
      const event = this.stripeService.constructEvent(
        request.rawBody,
        sig,
        process.env.STRIPE_CREATED_SUB_KEY,
      );
      const userId = event.data.object['client_reference_id'];
      const customerId = event.data.object['customer'];
      await this.subscriptionService.userSubscribed(userId);
      await this.customerService.createCustomer(userId, customerId);
    } catch (err) {
      throw new BadRequestException(`Webhook Error: ${err.message}`);
    }
  }

  @ApiOkResponse()
  @HttpCode(200)
  @Post('canceled')
  async canceledSubscription(@Headers() headers, @Body() body: string) {
    try {
      const sig = headers['stripe-signature'];
      const event = this.stripeService.constructEvent(
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

  @ApiOperation({
    description: 'Get checkout session',
  })
  @ApiBadRequestResponse()
  @ApiOkResponse()
  @HttpCode(200)
  @Get('checkout')
  async getCheckoutSession(@Headers() headers) {
    const userId = headers['user-id'] as string;
    const customer = await this.customerService.getById(userId);
    const checkout = await this.stripeService.getCheckoutSessionUrl(
      userId,
      customer?.customerId,
    );
    return { url: checkout.url };
  }
}

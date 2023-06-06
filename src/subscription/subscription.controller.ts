import {
  BadRequestException,
  Controller,
  Delete,
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
import UserService from '../user/user.service';

@ApiTags('/subscription')
@Controller({ path: '/subscription' })
export class SubscriptionController {
  constructor(
    private subscriptionService: SubscriptionService,
    private userService: UserService,
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
      if (event.data.object['mode'] === 'subscription') {
        await this.subscription(event);
      } else {
        await this.methodPayment(event);
      }
    } catch (err) {
      throw new BadRequestException(`Webhook Error: ${err.message}`);
    }
  }

  @ApiOkResponse()
  @HttpCode(200)
  @Post('canceled')
  async canceledSubscription(
    @Headers() headers,
    @Req() request: RawBodyRequest<Request>,
  ) {
    try {
      const sig = headers['stripe-signature'];
      const event = this.stripeService.constructEvent(
        request.rawBody,
        sig,
        process.env.STRIPE_CANCELED_SUB_KEY,
      );
      console.log(event);
      const subscriptionId = event.data.object['id'];
      const customer = await this.customerService.getBySubId(subscriptionId);
      this.userService.userUnsubscribed(customer.userId);
      await this.subscriptionService.deleteSubscription(subscriptionId);
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
  @Get('subscribe')
  async subscribe(@Headers() headers) {
    const userId = headers['user-id'] as string;
    const subscription = await this.subscriptionService.getSubscriptionByUserId(
      userId,
    );
    if (subscription) {
      throw new BadRequestException('Already subscribed');
    }
    const customer = await this.customerService.getById(userId);
    const checkout = await this.stripeService.getCheckoutSubscribeUrl(
      userId,
      customer?.customerId,
    );
    return { url: checkout.url };
  }

  @ApiOperation({
    description: 'Change payment method',
  })
  @ApiBadRequestResponse()
  @ApiOkResponse()
  @HttpCode(200)
  @Get('payment-method')
  async updatePaymentMethod(@Headers() headers) {
    const userId = headers['user-id'] as string;
    const subscription = await this.subscriptionService.getSubscriptionByUserId(
      userId,
    );
    if (!subscription) {
      throw new BadRequestException('Not subscribed');
    }
    const customer = await this.customerService.getById(userId);
    const checkout = await this.stripeService.getCheckoutMethodUrl(
      subscription.id,
      customer?.customerId,
    );
    return { url: checkout.url };
  }

  @ApiOperation({
    description: 'Stop subscription when period ends',
  })
  @ApiBadRequestResponse()
  @ApiOkResponse()
  @HttpCode(200)
  @Delete()
  async endSubscription(@Headers() headers) {
    const userId = headers['user-id'] as string;
    const subscription = await this.subscriptionService.getSubscriptionByUserId(
      userId,
    );
    if (!subscription) {
      throw new BadRequestException('Not subscribed');
    }
    await this.stripeService.cancelSubscription(subscription.id);
  }

  private async methodPayment(event) {
    const intentId = event.data.object['setup_intent'];
    await this.stripeService.updatePaymentMethod(intentId);
  }

  private async subscription(event) {
    const userId = event.data.object['client_reference_id'];
    const customerId = event.data.object['customer'];
    const subscriptionId = event.data.object['subscription'];
    await this.userService.userSubscribed(userId);
    const customer = await this.customerService.createCustomer(
      userId,
      customerId,
    );
    await this.subscriptionService.createSubscription(subscriptionId, customer);
  }
}

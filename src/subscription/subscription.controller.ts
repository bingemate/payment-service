import {
  BadRequestException,
  Body,
  Controller,
  Delete,
  Get,
  Headers,
  HttpCode,
  NotFoundException,
  Param,
  Post,
  RawBodyRequest,
  Req,
} from '@nestjs/common';
import {
  ApiBadRequestResponse,
  ApiNotFoundResponse,
  ApiOkResponse,
  ApiOperation,
  ApiTags,
} from '@nestjs/swagger';
import SubscriptionService from './subscription.service';
import StripeService from '../stripe/stripe.service';
import CustomerService from '../customer/customer.service';
import UserService from '../user/user.service';
import { SubscriptionDto } from './dto/subscription.dto';
import { CreateSubscriptionDto } from './dto/create-subscription.dto';

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
      const subscriptionId = event.data.object['id'];
      const customer = await this.customerService.getBySubId(subscriptionId);
      if (!customer) {
        return;
      }
      this.userService.userUnsubscribed(customer.userId).subscribe();
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
    const customer = await this.customerService.getByUserId(userId);
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
    const customer = await this.customerService.getByUserId(userId);
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
  async stopSubscription(@Headers() headers) {
    const userId = headers['user-id'] as string;
    const subscription = await this.subscriptionService.getSubscriptionByUserId(
      userId,
    );
    if (!subscription) {
      throw new BadRequestException('Not subscribed');
    }
    await this.stripeService.stopSubscription(subscription.id);
  }

  @ApiOperation({
    description: 'Get subscription details',
  })
  @ApiNotFoundResponse()
  @ApiOkResponse()
  @HttpCode(200)
  @Get()
  async getSubscriptionDetails(@Headers() headers): Promise<SubscriptionDto> {
    const userId = headers['user-id'] as string;
    const subscription = await this.subscriptionService.getSubscriptionByUserId(
      userId,
    );
    if (!subscription) {
      throw new NotFoundException('Not subscribed');
    }
    const subscriptionDetails = await this.stripeService.getSubscription(
      subscription.id,
    );
    return {
      status: subscriptionDetails.status,
      price: subscriptionDetails.items.data[0].price.unit_amount / 100,
      isCanceled: subscriptionDetails.cancel_at_period_end,
      startedAt: subscriptionDetails.start_date,
      nextPaymentAt: subscriptionDetails.current_period_end,
      endAt: subscriptionDetails.cancel_at,
      discount: subscriptionDetails.discount
        ? {
            code: subscriptionDetails.discount.coupon.name,
            percent: subscriptionDetails.discount.coupon.percent_off,
          }
        : undefined,
    };
  }

  @ApiOperation({
    description: 'Get subscription details for user',
  })
  @ApiNotFoundResponse()
  @ApiOkResponse()
  @HttpCode(200)
  @Get('/details/:userId')
  async getSubscriptionDetailsByUserId(
    @Headers() headers,
    @Param('userId') userId: string,
  ): Promise<SubscriptionDto> {
    const subscription = await this.subscriptionService.getSubscriptionByUserId(
      userId,
    );
    if (!subscription) {
      throw new NotFoundException('Not subscribed');
    }
    const subscriptionDetails = await this.stripeService.getSubscription(
      subscription.id,
    );
    return {
      status: subscriptionDetails.status,
      price: subscriptionDetails.items.data[0].price.unit_amount / 100,
      isCanceled: subscriptionDetails.cancel_at_period_end,
      startedAt: subscriptionDetails.start_date,
      nextPaymentAt: subscriptionDetails.current_period_end,
      endAt: subscriptionDetails.cancel_at,
      discount: subscriptionDetails.discount
        ? {
            code: subscriptionDetails.discount.coupon.name,
            percent: subscriptionDetails.discount.coupon.percent_off,
          }
        : undefined,
    };
  }

  @ApiOperation({
    description: 'Create subscription',
  })
  @ApiBadRequestResponse()
  @ApiOkResponse()
  @HttpCode(200)
  @Post('/create')
  async createSubscription(
    @Headers() headers,
    @Body() create: CreateSubscriptionDto,
  ) {
    const customer = await this.customerService.getByUserId(create.userId);
    if (!customer) {
      throw new NotFoundException('Customer not found');
    }
    const subscriptionId = await this.stripeService.createSubscription(
      customer.customerId,
      create.cancelAt,
    );
    return {
      id: await this.subscriptionService.createSubscription(
        subscriptionId,
        customer,
      ),
    };
  }

  @ApiOperation({
    description: 'Cancel subscription immediately',
  })
  @ApiBadRequestResponse()
  @ApiOkResponse()
  @HttpCode(200)
  @Delete('/cancel/:userId')
  async cancelSubscription(
    @Headers() headers,
    @Param('userId') userId: string,
  ) {
    const subscription = await this.subscriptionService.getSubscriptionByUserId(
      userId,
    );
    if (!subscription) {
      throw new BadRequestException("Subscription doesn't exist");
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
    this.userService.userSubscribed(userId).subscribe();
    const customer = await this.customerService.saveCustomer(
      userId,
      customerId,
    );
    await this.subscriptionService.createSubscription(subscriptionId, customer);
  }
}

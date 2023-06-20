import {
  BadRequestException,
  Body,
  Controller,
  Headers,
  HttpCode,
  Post,
} from '@nestjs/common';
import { ApiOkResponse, ApiTags } from '@nestjs/swagger';
import StripeService from '../stripe/stripe.service';
import CustomerService from '../customer/customer.service';
import { CreateCustomerDto } from './dto/create-customer.dto';

@ApiTags('/customer')
@Controller({ path: '/customer' })
export class CustomerController {
  constructor(
    private customerService: CustomerService,
    private stripeService: StripeService,
  ) {}

  @ApiOkResponse()
  @HttpCode(200)
  @Post()
  async createdSubscription(
    @Headers() headers,
    @Body() createCustomerDto: CreateCustomerDto,
  ) {
    try {
      const customerId = await this.stripeService.createCustomer(
        createCustomerDto.email,
        createCustomerDto.name,
      );
      await this.customerService.saveCustomer(
        createCustomerDto.userId,
        customerId,
      );
    } catch (err) {
      throw new BadRequestException(`Webhook Error: ${err.message}`);
    }
  }
}

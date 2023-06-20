import {
  Body,
  Controller,
  Get,
  Headers,
  HttpCode,
  NotFoundException,
  Param,
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
  async createdCustomer(
    @Headers() headers,
    @Body() createCustomerDto: CreateCustomerDto,
  ) {
    const customerId = await this.stripeService.createCustomer(
      createCustomerDto.email,
      createCustomerDto.name,
    );
    await this.customerService.saveCustomer(
      createCustomerDto.userId,
      customerId,
    );
  }

  @ApiOkResponse()
  @HttpCode(200)
  @Get('/:userId')
  async getCustomer(@Headers() headers, @Param('userId') userId: string) {
    const customer = await this.customerService.getByUserId(userId);
    if (!customer) {
      throw new NotFoundException('User has no customer attached');
    }
  }
}

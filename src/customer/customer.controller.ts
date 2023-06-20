import {
  Controller,
  Get,
  Headers,
  HttpCode,
  NotFoundException,
  Param,
} from '@nestjs/common';
import { ApiOkResponse, ApiTags } from '@nestjs/swagger';
import CustomerService from '../customer/customer.service';

@ApiTags('/customer')
@Controller({ path: '/customer' })
export class CustomerController {
  constructor(private customerService: CustomerService) {}

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

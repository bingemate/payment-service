import { Controller, Get, Headers, HttpCode } from '@nestjs/common';
import { ApiOkResponse, ApiOperation, ApiTags } from '@nestjs/swagger';
import PaymentService from './payment.service';

@ApiTags('/payment')
@Controller({ path: '/payment' })
export class PaymentController {
  constructor(private paymentService: PaymentService) {}

  @ApiOperation({
    description: 'Get checkout session',
  })
  @ApiOkResponse()
  @HttpCode(200)
  @Get('checkout')
  async getCheckoutSession(@Headers() headers) {
    const userId = headers['user-id'] as string;
    const checkout = await this.paymentService.getCheckoutSessionUrl(userId);
    return checkout.url;
  }
}

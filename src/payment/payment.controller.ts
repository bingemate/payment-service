import { Controller, Delete, Headers, HttpCode, Param } from '@nestjs/common';
import {
  ApiNoContentResponse,
  ApiOperation,
  ApiParam,
  ApiTags,
} from '@nestjs/swagger';
import PaymentService from './payment.service';

@ApiTags('/payment')
@Controller({ path: '/payment' })
export class PaymentController {
  constructor(private paymentService: PaymentService) {}

  @ApiOperation({
    description: 'Delete history entry',
  })
  @ApiNoContentResponse()
  @ApiParam({ name: 'mediaId' })
  @HttpCode(204)
  @Delete('/:mediaId')
  async deleteMediaHistoryById(
    @Param('mediaId') mediaId: number,
    @Headers() headers,
  ) {
    const userId = headers['user-id'] as string;
    const checkout = await this.paymentService.getCheckoutSessionId(userId);
    return checkout.id;
  }
}

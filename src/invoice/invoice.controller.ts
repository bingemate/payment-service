import {
  Controller,
  Get,
  Headers,
  HttpCode,
  NotFoundException,
} from '@nestjs/common';
import {
  ApiBadRequestResponse,
  ApiOkResponse,
  ApiOperation,
  ApiTags,
} from '@nestjs/swagger';
import StripeService from '../stripe/stripe.service';
import CustomerService from '../customer/customer.service';
import { InvoiceDto } from './dto/invoice.dto';

@ApiTags('/invoice')
@Controller({ path: '/invoice' })
export class InvoiceController {
  constructor(
    private stripeService: StripeService,
    private customerService: CustomerService,
  ) {}

  @ApiOperation({
    description: 'Change payment method',
  })
  @ApiBadRequestResponse()
  @ApiOkResponse()
  @HttpCode(200)
  @Get()
  async updatePaymentMethod(@Headers() headers): Promise<InvoiceDto[]> {
    const userId = headers['user-id'] as string;
    const customer = await this.customerService.getById(userId);
    if (!customer) {
      throw new NotFoundException();
    }
    const invoices = await this.stripeService.getCustomerInvoices(
      customer.customerId,
    );
    return invoices.map((invoice) => ({
      invoiceUrl: invoice.hosted_invoice_url,
      invoicePdfUrl: invoice.invoice_pdf,
      created: invoice.created,
      status: invoice.status,
      paymentMethod: invoice.payment_settings.payment_method_types[0],
      price: invoice.paid ? invoice.amount_paid : invoice.amount_due,
      currency: invoice.currency,
    }));
  }
}

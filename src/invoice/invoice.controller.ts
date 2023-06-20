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
    description: 'Retrieves user invoices',
  })
  @ApiBadRequestResponse()
  @ApiOkResponse()
  @HttpCode(200)
  @Get()
  async getInvoices(@Headers() headers): Promise<InvoiceDto[]> {
    const userId = headers['user-id'] as string;
    const customer = await this.customerService.getByUserId(userId);
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
      price: invoice.paid ? invoice.amount_paid : invoice.amount_due,
      currency: invoice.currency,
    }));
  }
}

import { ApiProperty } from '@nestjs/swagger';

export class InvoiceDto {
  @ApiProperty()
  invoiceUrl: string;
  @ApiProperty()
  invoicePdfUrl: string;
  @ApiProperty()
  created: number;
  @ApiProperty()
  status: string;
  @ApiProperty()
  paymentMethods: string;
  @ApiProperty()
  price: number;
  @ApiProperty()
  currency: string;
}

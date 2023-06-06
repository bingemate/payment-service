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
}

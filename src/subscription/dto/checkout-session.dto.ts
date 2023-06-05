import { ApiProperty } from '@nestjs/swagger';

export class CheckoutSessionDto {
  @ApiProperty()
  sessionId: string;
}

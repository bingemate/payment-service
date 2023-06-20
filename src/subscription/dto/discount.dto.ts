import { ApiProperty } from '@nestjs/swagger';

export class DiscountDto {
  @ApiProperty()
  code: string;
  @ApiProperty()
  percent: number;
}

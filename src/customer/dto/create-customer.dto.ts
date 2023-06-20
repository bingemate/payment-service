import { ApiProperty } from '@nestjs/swagger';

export class CreateCustomerDto {
  @ApiProperty({ type: 'uuid' })
  userId: string;
  @ApiProperty()
  name: string;
  @ApiProperty()
  email: string;
}

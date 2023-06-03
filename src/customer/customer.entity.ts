import { Column, Entity, PrimaryColumn } from 'typeorm';

@Entity('customer')
export class CustomerEntity {
  @Column()
  customerId: string;
  @PrimaryColumn('uuid')
  userId: string;
}

import {
  CreateDateColumn,
  DeleteDateColumn,
  Entity,
  JoinColumn,
  ManyToOne,
  PrimaryColumn,
} from 'typeorm';
import { CustomerEntity } from '../customer/customer.entity';

@Entity('subscription')
export class SubscriptionEntity {
  @PrimaryColumn()
  id: string;
  @ManyToOne(
    () => CustomerEntity,
    (customerEntity) => customerEntity.subscriptions,
  )
  @JoinColumn({ name: 'userId' })
  customer: CustomerEntity;
  @CreateDateColumn()
  createdAt: Date;
  @DeleteDateColumn()
  deletedAt: Date;
}

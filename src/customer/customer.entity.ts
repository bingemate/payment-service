import { Column, Entity, OneToMany, PrimaryColumn } from 'typeorm';
import { SubscriptionEntity } from '../subscription/subscription.entity';

@Entity('customer')
export class CustomerEntity {
  @Column()
  customerId: string;
  @PrimaryColumn('uuid')
  userId: string;
  @OneToMany(() => SubscriptionEntity, (subscription) => subscription.customer)
  subscriptions: SubscriptionEntity;
}

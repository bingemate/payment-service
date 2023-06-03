import {
  Column,
  CreateDateColumn,
  Entity,
  PrimaryGeneratedColumn,
} from 'typeorm';

@Entity('subscription')
export class SubscriptionEntity {
  @PrimaryGeneratedColumn('uuid')
  id: string;
  @Column()
  userId: string;
  @Column()
  subscriptionId: string;
  @CreateDateColumn()
  createdAt: Date;
}

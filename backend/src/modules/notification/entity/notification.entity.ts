import {
  Entity,
  PrimaryGeneratedColumn,
  CreateDateColumn,
  Column,
} from 'typeorm';

export enum NotificationType {
  NEW_ORDER = 'NEW_ORDER',
  SELLER_CONFIRMED = 'SELLER_CONFIRMED',
  ORDER_SHIPPING = 'ORDER_SHIPPING',
}

@Entity('notifications')
export class Notification {
  @PrimaryGeneratedColumn()
  id: number;

  @Column({
    type: 'enum',
    enum: NotificationType,
    default: NotificationType.NEW_ORDER,
  })
  type: NotificationType;

  @Column()
  userId: number;

  @Column({ default: false })
  isRead: boolean;

  @CreateDateColumn()
  createdAt: Date;
}

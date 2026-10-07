import {
  Column,
  CreateDateColumn,
  Entity,
  JoinColumn,
  ManyToOne,
  PrimaryGeneratedColumn,
  UpdateDateColumn,
} from 'typeorm';
import { User } from '../../user/entity/user.entity';

@Entity('products')
export class Product {
  @PrimaryGeneratedColumn()
  id: number;

  @Column()
  name: string;

  @Column()
  imageKey: string;

  @Column()
  originalPrice: number;

  @Column()
  isDiscount: boolean;

  @Column({ type: 'integer', nullable: true })
  discountPrice: number;

  @Column()
  stockQuantity: number;

  @Column({ default: 0 })
  soldQuantity: number;

  @Column({ default: 0 })
  reviewCount: number;

  @Column({ type: 'decimal', precision: 2, scale: 1, default: 0 })
  ratingAvg: number;

  @Column()
  categoryId: number;

  // Seller
  @ManyToOne(() => User, (seller) => seller.products)
  @JoinColumn({ name: 'seller_id' })
  seller: User;

  @CreateDateColumn()
  createdAt: Date;

  @UpdateDateColumn()
  updatedAt: Date;
}

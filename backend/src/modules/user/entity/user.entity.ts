import {
  Column,
  CreateDateColumn,
  Entity,
  OneToMany,
  PrimaryGeneratedColumn,
  UpdateDateColumn,
} from 'typeorm';
import { UserRole } from '../../../shared/enum/user-role.enum';
import { Product } from '../../product/entity/product.entity';
import { Review } from '../../review/entity/review.entity';

@Entity('users')
export class User {
  @PrimaryGeneratedColumn()
  id: number;

  @Column({ unique: true })
  email: string;

  @Column()
  password: string;

  @Column({ nullable: true })
  firstName: string;

  @Column({ nullable: true })
  lastName: string;

  @Column({ nullable: true })
  shopName: string;

  @Column({ nullable: true })
  address: string;

  @Column({ nullable: true })
  avatarKey: string;

  @Column({ nullable: true })
  phone: string;

  @Column({ type: 'enum', enum: UserRole })
  role: UserRole;

  @OneToMany(() => Product, (product) => product.seller)
  products: Product[];

  @OneToMany(() => Review, (review) => review.customer)
  reviews: Review[];

  @CreateDateColumn()
  createdAt: Date;

  @UpdateDateColumn()
  updatedAt: Date;
}

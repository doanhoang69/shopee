import { Module } from '@nestjs/common';
import { CartService } from './cart.service';
import { CartController } from './cart.controller';
import { JwtService } from '@nestjs/jwt';
import { TypeOrmModule } from '@nestjs/typeorm';
import { AuthModule } from '../auth/auth.module';
import { Product } from '../product/entity/product.entity';
import { Cart } from './entity/cart.entity';
import { CartItem } from './entity/cart-item.entity';
import { User } from '../user/entity/user.entity';

@Module({
  imports: [
    TypeOrmModule.forFeature([Product, User, Cart, CartItem]),
    AuthModule,
  ],
  controllers: [CartController],
  providers: [CartService, JwtService],
})
export class CartModule {}

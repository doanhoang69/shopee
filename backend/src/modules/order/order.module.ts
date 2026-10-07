import { Module } from '@nestjs/common';
import { OrderService } from './order.service';
import { OrderController } from './order.controller';
import { JwtService } from '@nestjs/jwt';
import { TypeOrmModule } from '@nestjs/typeorm';
import { AuthModule } from '../auth/auth.module';
import { Product } from '../product/entity/product.entity';
import { Order } from './entity/order.entity';
import { OrderItem } from './entity/order-item.entity';
import { User } from '../user/entity/user.entity';
import { NotificationModule } from '../notification/notification.module';
import { Notification } from '../notification/entity/notification.entity';

@Module({
  imports: [
    TypeOrmModule.forFeature([Order, OrderItem, Product, User, Notification]),
    AuthModule,
    NotificationModule,
  ],
  controllers: [OrderController],
  providers: [OrderService, JwtService],
})
export class OrderModule {}

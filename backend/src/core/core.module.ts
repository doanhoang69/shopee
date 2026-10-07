import { Module } from '@nestjs/common';
import { ConfigModule, ConfigService } from '@nestjs/config';
import { TypeOrmModule } from '@nestjs/typeorm';
import { AuthModule } from '../modules/auth/auth.module';
import { CartModule } from '../modules/cart/cart.module';
import { OrderModule } from '../modules/order/order.module';
import { ProductModule } from '../modules/product/product.module';
import { UserModule } from '../modules/user/user.module';
import { NotificationModule } from '../modules/notification/notification.module';
import { ReviewModule } from '../modules/review/review.module';

@Module({
  imports: [
    ConfigModule.forRoot({
      isGlobal: true,
    }),
    TypeOrmModule.forRootAsync({
      imports: [ConfigModule],
      inject: [ConfigService],
      useFactory: (configService: ConfigService) => ({
        type: 'postgres',
        host: configService.getOrThrow<string>('DB_HOST'),
        port: parseInt(configService.getOrThrow<string>('DB_PORT'), 10),
        username: configService.getOrThrow<string>('DB_USERNAME'),
        password: configService.getOrThrow<string>('DB_PASSWORD'),
        database: configService.getOrThrow<string>('DB_NAME'),
        autoLoadEntities: true,
        synchronize: true,
      }),
    }),
    AuthModule,
    ProductModule,
    CartModule,
    OrderModule,
    UserModule,
    NotificationModule,
    ReviewModule,
  ],
})
export class CoreModule {}

import { Module } from '@nestjs/common';
import { ProductService } from './product.service';
import { ProductController } from './product.controller';
import { TypeOrmModule } from '@nestjs/typeorm';
import { Product } from './entity/product.entity';
import { AuthModule } from '../auth/auth.module';
import { JwtService } from '@nestjs/jwt';
import { User } from '../user/entity/user.entity';
import { StorageModule } from '../../core/storage/storage.module';
import { Review } from '../review/entity/review.entity';

@Module({
  imports: [
    TypeOrmModule.forFeature([Product, User, Review]),
    AuthModule,
    StorageModule,
  ],
  controllers: [ProductController],
  providers: [ProductService, JwtService],
})
export class ProductModule {}

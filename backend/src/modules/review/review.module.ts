import { Module } from '@nestjs/common';
import { ReviewService } from './review.service';
import { ReviewController } from './review.controller';
import { TypeOrmModule } from '@nestjs/typeorm';
import { StorageService } from '../../core/storage/storage.service';
import { JwtService } from '@nestjs/jwt';
import { AuthModule } from '../auth/auth.module';
import { Review } from './entity/review.entity';
import { Product } from '../product/entity/product.entity';

@Module({
  imports: [TypeOrmModule.forFeature([Review, Product]), AuthModule],
  controllers: [ReviewController],
  providers: [ReviewService, StorageService, JwtService],
})
export class ReviewModule {}

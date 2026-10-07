import { Injectable, NotFoundException } from '@nestjs/common';
import { DataSource, Repository } from 'typeorm';
import { StorageService } from '../../core/storage/storage.service';
import { ReviewProductDto } from './dto/review-product.dto';
import { Product } from '../product/entity/product.entity';
import { Review } from './entity/review.entity';
import { v4 as uuidv4 } from 'uuid';
import { InjectRepository } from '@nestjs/typeorm';

@Injectable()
export class ReviewService {
  constructor(
    @InjectRepository(Review)
    private readonly reviewRepository: Repository<Review>,
    @InjectRepository(Product)
    private readonly productRepository: Repository<Product>,
    private readonly dataSource: DataSource,
    private readonly storageService: StorageService,
  ) {}

  async reviewProduct(
    userId: number,
    productId: number,
    reviewPayload: ReviewProductDto,
    image?: Express.Multer.File,
  ) {
    const { content, rating } = reviewPayload;

    let imageKey: string | undefined;
    if (image) {
      imageKey = this.generateImageKey('reviews', image.originalname);
      await this.storageService.upload(image.buffer, imageKey, image.mimetype);
    }

    try {
      await this.dataSource.transaction(async (manager) => {
        // Kiểm tra product tồn tại (không cần lock)
        const product = await manager.findOne(Product, {
          where: { id: productId },
        });

        if (!product) {
          throw new NotFoundException('Không tìm thấy sản phẩm');
        }

        const review = manager.create(Review, {
          content,
          rating,
          customer: { id: userId },
          product: { id: productId },
          imageKey,
        });
        await manager.save(review);

        // Update atomic ngay trong SQL, không cần đọc-tính-ghi ở app
        await manager
          .createQueryBuilder()
          .update(Product)
          .set({
            reviewCount: () => '"reviewCount" + 1',
            ratingAvg: () =>
              `("ratingAvg" * "reviewCount" + :rating) / ("reviewCount" + 1)`,
          })
          .where('id = :productId', { productId })
          .setParameters({ rating, productId })
          .execute();
      });

      return { success: true, message: 'Đánh giá sản phẩm thành công' };
    } catch (err) {
      if (imageKey) {
        await this.storageService.delete(imageKey);
      }
      throw err;
    }
  }

  async getAllReviews(productId: number, page: number) {
    const PAGE_SIZE = 10;
    const take = PAGE_SIZE;
    const skip = (page - 1) * PAGE_SIZE;

    const product = await this.productRepository.findOneBy({ id: productId });

    if (!product) {
      throw new NotFoundException('Không tìm thấy sản phẩm');
    }

    const [data, total] = await this.reviewRepository.findAndCount({
      where: {
        product: { id: productId },
      },
      relations: {
        customer: true,
      },
      select: {
        id: true,
        content: true,
        imageKey: true,
        rating: true,
        customer: {
          firstName: true,
          lastName: true,
          avatarKey: true,
        },
        createdAt: true,
      },
      order: {
        createdAt: 'DESC',
      },
      take,
      skip,
    });

    return {
      data,
      meta: {
        page,
        totalPages: Math.ceil(total / PAGE_SIZE),
      },
    };
  }

  private generateImageKey(
    type: 'avatars' | 'products' | 'reviews',
    originalFileName: string,
  ): string {
    const ext = originalFileName.split('.').pop();
    return `${type}/${uuidv4()}.${ext}`;
  }
}

import {
  ForbiddenException,
  Injectable,
  NotFoundException,
} from '@nestjs/common';
import { DisplayProductDto } from './dto/display-product.dto';
import { InjectRepository } from '@nestjs/typeorm';
import { Product } from './entity/product.entity';
import { FindOptionsOrder, FindOptionsWhere, ILike, Repository } from 'typeorm';
import { v4 as uuidv4 } from 'uuid';
import { StorageService } from '../../core/storage/storage.service';
import { UpdateProductDto } from './dto/update-product.dto';
import { GetProductsDto } from './dto/get-products.dto';
import { User } from '../user/entity/user.entity';

@Injectable()
export class ProductService {
  constructor(
    @InjectRepository(Product)
    private readonly productRepository: Repository<Product>,
    @InjectRepository(User)
    private readonly userRepository: Repository<User>,
    private readonly storageService: StorageService,
  ) {}

  async getAllProducts({
    categoryId,
    sellerId,
    search,
    sortBy,
    order,
    page,
  }: GetProductsDto) {
    const PAGE_SIZE = 20;
    const take = PAGE_SIZE;
    const skip = (page - 1) * PAGE_SIZE;

    let orderOption: FindOptionsOrder<Product> = {};

    switch (sortBy) {
      case 'price':
        orderOption = {
          originalPrice: order === 'desc' ? 'DESC' : 'ASC',
        };
        break;
      case 'sales':
        orderOption = { soldQuantity: 'DESC' };
        break;
      case 'time':
        orderOption = { createdAt: 'DESC' };
        break;
      default:
        orderOption = {};
    }

    const whereOption: FindOptionsWhere<Product> = {
      ...(categoryId && { categoryId }),
      ...(sellerId && { seller: { id: sellerId } }),
      ...(search && { name: ILike(`%${search}%`) }),
    };

    const [data, total] = await this.productRepository.findAndCount({
      where: whereOption,
      select: {
        id: true,
        name: true,
        categoryId: true,
        imageKey: true,
        originalPrice: true,
        isDiscount: true,
        discountPrice: true,
        soldQuantity: true,
        ratingAvg: true,
        createdAt: true,
      },
      order: orderOption,
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

  async getProductById(productId: number) {
    const product = await this.productRepository
      .createQueryBuilder('product')
      .leftJoin('product.seller', 'seller')
      .select([
        'product.id',
        'product.name',
        'product.imageKey',
        'product.originalPrice',
        'product.isDiscount',
        'product.discountPrice',
        'product.soldQuantity',
        'product.stockQuantity',
        'product.reviewCount',
        'product.ratingAvg',
        'seller.id',
        'seller.shopName',
        'seller.avatarKey',
      ])
      .where('product.id = :productId', { productId })
      .getOne();

    if (!product) {
      throw new NotFoundException('Product not found');
    }

    return product;
  }

  async displayNewProduct(
    sellerId: number,
    product: DisplayProductDto,
    image: Express.Multer.File,
  ) {
    const seller = await this.userRepository.findOneBy({
      id: sellerId,
    });

    if (!seller) {
      throw new NotFoundException('Seller not found');
    }

    const imageKey = this.generateImageKey('products', image.originalname);

    await this.storageService.upload(image.buffer, imageKey, image.mimetype);

    const newProduct = this.productRepository.create({
      ...product,
      imageKey,
      categoryId: product.categoryId,
      seller,
    });

    try {
      await this.productRepository.save(newProduct);
      return { success: true, message: 'Display product successfully!' };
    } catch (err) {
      // Nếu lưu DB thất bại, xóa luôn ảnh vừa upload để tránh rác trên S3
      await this.storageService.delete(imageKey);
      throw err;
    }
  }

  async updateProduct(
    sellerId: number,
    productId: number,
    updateDto: UpdateProductDto,
    image?: Express.Multer.File,
  ) {
    const product = await this.productRepository.findOne({
      where: { id: productId },
      relations: {
        seller: true,
      },
    });

    if (!product) {
      throw new NotFoundException('Product not found');
    }

    if (product.seller.id !== sellerId) {
      throw new ForbiddenException(
        'You do not have permission to update this product',
      );
    }

    const oldKey = product.imageKey;
    let newKey = product.imageKey;

    if (image) {
      newKey = this.generateImageKey('products', image.originalname);
      await this.storageService.upload(image.buffer, newKey, image.mimetype);
    }

    const updatedProduct = {
      ...product,
      ...updateDto,
      imageKey: newKey,
    };

    try {
      const saved = await this.productRepository.save(updatedProduct);

      // Nếu upload ảnh mới thành công và có ảnh cũ -> xoá ảnh cũ trên S3
      if (image && oldKey) {
        await this.storageService.delete(oldKey);
      }

      return saved;
    } catch (err) {
      // Nếu save DB fail và đã upload ảnh mới -> xoá ảnh mới vừa upload để tránh rác
      if (image) {
        await this.storageService.delete(newKey);
      }
      throw err;
    }
  }

  async deleteProduct(sellerId: number, productId: number) {
    const product = await this.productRepository.findOne({
      where: { id: productId },
      relations: {
        seller: true,
      },
    });

    if (!product) {
      throw new NotFoundException('Product not found');
    }

    if (product.seller.id !== sellerId) {
      throw new ForbiddenException(
        'You do not have permission to delete this product',
      );
    }

    await this.productRepository.remove(product);

    // Xoá ảnh trên S3 sau khi xoá DB thành công
    if (product.imageKey) {
      await this.storageService.delete(product.imageKey);
    }

    return { success: true, message: 'Product deleted successfully' };
  }

  private generateImageKey(
    type: 'avatars' | 'products' | 'reviews',
    originalFileName: string,
  ): string {
    const ext = originalFileName.split('.').pop();
    return `${type}/${uuidv4()}.${ext}`;
  }
}

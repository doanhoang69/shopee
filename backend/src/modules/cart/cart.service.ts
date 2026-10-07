import { Injectable, NotFoundException } from '@nestjs/common';
import { AddToCartDto } from './dto/add-to-cart.dto';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { Cart } from './entity/cart.entity';
import { CartItem } from './entity/cart-item.entity';
import { Product } from '../product/entity/product.entity';
import { UpdateCartItemDto } from './dto/update-cart-item.dto';
import { User } from '../user/entity/user.entity';

@Injectable()
export class CartService {
  constructor(
    @InjectRepository(Product)
    private readonly productRepository: Repository<Product>,
    @InjectRepository(Cart)
    private readonly cartRepository: Repository<Cart>,
    @InjectRepository(CartItem)
    private readonly cartItemRepository: Repository<CartItem>,
  ) {}

  async getMyCart(userId: number, page: number) {
    const PAGE_SIZE = 10;

    let cart = await this.cartRepository.findOne({
      where: { user: { id: userId } },
    });

    if (!cart) {
      cart = this.cartRepository.create({ user: { id: userId } as User });
      cart = await this.cartRepository.save(cart);

      return {
        data: [],
        meta: {
          page,
          totalPages: 0,
        },
      };
    }

    const [items, total] = await this.cartItemRepository.findAndCount({
      where: { cart: { id: cart.id } },
      relations: {
        product: {
          seller: true,
        },
      },
      select: {
        id: true,
        quantity: true,
        product: {
          id: true,
          name: true,
          imageKey: true,
          originalPrice: true,
          isDiscount: true,
          discountPrice: true,
          stockQuantity: true,
          seller: {
            id: true,
            shopName: true,
          },
        },
      },
      skip: (page - 1) * PAGE_SIZE,
      take: PAGE_SIZE,
    });

    return {
      data: items,
      meta: {
        page,
        totalPages: Math.ceil(total / PAGE_SIZE),
      },
    };
  }

  async getCartItemCount(userId: number) {
    const cart = await this.cartRepository.findOne({
      where: { user: { id: userId } },
    });

    if (!cart) return 0;

    const count = await this.cartItemRepository.count({
      where: { cart: { id: cart.id } },
    });

    return count;
  }

  async addToCart(
    customerId: number,
    productId: number,
    addToCartDto: AddToCartDto,
  ) {
    const { quantity } = addToCartDto;

    const product = await this.productRepository.findOneBy({ id: productId });

    if (!product) {
      throw new NotFoundException('Product not found');
    }

    // Tìm cart hiện có của user, nếu chưa có thì tạo mới
    let cart = await this.cartRepository.findOne({
      where: { user: { id: customerId } },
    });

    if (!cart) {
      cart = this.cartRepository.create({
        user: { id: customerId } as User,
      });
      cart = await this.cartRepository.save(cart);
    }

    // Kiểm tra sản phẩm đã có trong cart chưa (do có Unique constraint cart+product)
    let cartItem = await this.cartItemRepository.findOne({
      where: {
        cart: { id: cart.id },
        product: { id: productId },
      },
      relations: {
        product: true,
      },
    });

    if (cartItem) {
      // Đã tồn tại thì cộng dồn quantity
      cartItem.quantity += quantity;
    } else {
      // Chưa có thì tạo mới cart item
      cartItem = this.cartItemRepository.create({
        cart,
        product,
        quantity,
      });
    }

    this.cartItemRepository.save(cartItem);
    return {
      success: true,
      message: 'Add to cart successfully!',
    };
  }

  async updateCartItem(
    customerId: number,
    productId: number,
    updateCartItemDto: UpdateCartItemDto,
  ) {
    const { quantity } = updateCartItemDto;

    const cart = await this.cartRepository.findOne({
      where: { user: { id: customerId } },
    });

    if (!cart) {
      throw new NotFoundException('Cart not found');
    }

    const cartItem = await this.cartItemRepository.findOne({
      where: {
        cart: { id: cart.id },
        product: { id: productId },
      },
    });

    if (!cartItem) {
      throw new NotFoundException('This product is not in your cart');
    }

    cartItem.quantity = quantity;

    await this.cartItemRepository.save(cartItem);
    return {
      success: true,
      message: 'Update quantity successfully!',
    };
  }

  async removeCartItem(customerId: number, productId: number) {
    const cart = await this.cartRepository.findOne({
      where: { user: { id: customerId } },
    });

    if (!cart) {
      throw new NotFoundException('Cart not found');
    }

    const cartItem = await this.cartItemRepository.findOne({
      where: {
        cart: { id: cart.id },
        product: { id: productId },
      },
    });

    if (!cartItem) {
      throw new NotFoundException('This product is not in your cart');
    }

    await this.cartItemRepository.remove(cartItem);
    return {
      success: true,
      message: 'Delete cart item successfully!',
    };
  }
}

import {
  Body,
  Controller,
  Delete,
  Get,
  Param,
  ParseIntPipe,
  Patch,
  Post,
  Query,
  UseGuards,
} from '@nestjs/common';
import { CartService } from './cart.service';
import { AuthGuard } from '../auth/auth.guard';
import { AddToCartDto } from './dto/add-to-cart.dto';
import { UpdateCartItemDto } from './dto/update-cart-item.dto';
import { Authorized } from '../../shared/decorators/authorized.decorator';

@UseGuards(AuthGuard)
@Controller('carts')
export class CartController {
  constructor(private readonly cartService: CartService) {}

  @Get()
  getMyCart(
    @Authorized() userId: number,
    @Query('page', ParseIntPipe) page: number,
  ) {
    return this.cartService.getMyCart(userId, page);
  }

  @Get('count')
  async getCartItemCount(@Authorized() userId: number) {
    return await this.cartService.getCartItemCount(userId);
  }

  @Post(':productId')
  addToCart(
    @Authorized() userId: number,
    @Param('productId', ParseIntPipe) productId: number,
    @Body() addToCartDto: AddToCartDto,
  ) {
    return this.cartService.addToCart(userId, productId, addToCartDto);
  }

  @Patch(':productId')
  updateCartItem(
    @Authorized() userId: number,
    @Param('productId', ParseIntPipe) productId: number,
    @Body() updateCartItemDto: UpdateCartItemDto,
  ) {
    return this.cartService.updateCartItem(
      userId,
      productId,
      updateCartItemDto,
    );
  }

  @Delete(':productId')
  removeCartItem(
    @Authorized() userId: number,
    @Param('productId', ParseIntPipe) productId: number,
  ) {
    return this.cartService.removeCartItem(userId, productId);
  }
}

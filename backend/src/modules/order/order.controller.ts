import {
  Body,
  Controller,
  Get,
  Param,
  ParseIntPipe,
  Patch,
  Post,
  Query,
  UseGuards,
} from '@nestjs/common';
import { OrderService } from './order.service';
import { AuthGuard } from '../auth/auth.guard';
import { CreateOrderDto } from './dto/create-order.dto';
import { GetOrdersQueryDto } from './dto/get-orders-query.dto';
import { RolesGuard } from '../auth/roles.guard';
import { Roles } from '../../shared/decorators/roles.decorator';
import { UserRole } from '../../shared/enum/user-role.enum';
import { Authorized } from '../../shared/decorators/authorized.decorator';

@UseGuards(AuthGuard)
@Controller('orders')
export class OrderController {
  constructor(private readonly orderService: OrderService) {}

  @Roles(UserRole.CUSTOMER)
  @UseGuards(RolesGuard)
  @Get()
  getAllOrders(
    @Authorized() userId: number,
    @Query() getOrdersQuery: GetOrdersQueryDto,
  ) {
    return this.orderService.getAllOrders(userId, getOrdersQuery);
  }

  @Roles(UserRole.SELLER)
  @UseGuards(RolesGuard)
  @Get('seller')
  getAllSellerOrders(
    @Authorized() userId: number,
    @Query() getOrdersQuery: GetOrdersQueryDto,
  ) {
    return this.orderService.getAllSellerOrders(userId, getOrdersQuery);
  }

  @Roles(UserRole.CUSTOMER)
  @UseGuards(RolesGuard)
  @Post()
  createOrder(
    @Authorized() userId: number,
    @Body() createOrderDto: CreateOrderDto,
  ) {
    return this.orderService.createOrder(userId, createOrderDto);
  }

  @Roles(UserRole.SELLER)
  @UseGuards(RolesGuard)
  @Patch('confirm/:orderId')
  confirmOrder(@Param('orderId', ParseIntPipe) orderId: number) {
    return this.orderService.confirmOrder(orderId);
  }

  @Roles(UserRole.SHIPPER)
  @UseGuards(RolesGuard)
  @Patch('ship/:orderId')
  shipOrder(@Param('orderId', ParseIntPipe) orderId: number) {
    return this.orderService.shipOrder(orderId);
  }

  @Roles(UserRole.SHIPPER)
  @UseGuards(RolesGuard)
  @Patch('deliver/:orderId')
  deliverOrder(@Param('orderId', ParseIntPipe) orderId: number) {
    return this.orderService.deliverOrder(orderId);
  }

  @Roles(UserRole.CUSTOMER)
  @UseGuards(RolesGuard)
  @Patch('receive/:orderId')
  receiveOrder(@Param('orderId', ParseIntPipe) orderId: number) {
    return this.orderService.receiveOrder(orderId);
  }

  @Get(':orderId/unreviewed')
  getUnreviewedProducts(
    @Authorized() userId: number,
    @Param('orderId', ParseIntPipe) orderId: number,
  ) {
    return this.orderService.getUnreviewedProducts(orderId, userId);
  }
}

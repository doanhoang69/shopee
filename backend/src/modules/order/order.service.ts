import {
  BadRequestException,
  Injectable,
  NotFoundException,
} from '@nestjs/common';
import { Order, OrderStatus } from './entity/order.entity';
import { CreateOrderDto } from './dto/create-order.dto';
import { InjectRepository } from '@nestjs/typeorm';
import { Product } from '../product/entity/product.entity';
import { OrderItem } from './entity/order-item.entity';
import { DataSource, In, LessThan, Repository } from 'typeorm';
import { CartItem } from '../cart/entity/cart-item.entity';
import { Cart } from '../cart/entity/cart.entity';
import { GetOrdersQueryDto } from './dto/get-orders-query.dto';
import {
  Notification,
  NotificationType,
} from '../notification/entity/notification.entity';
import { NotificationService } from '../notification/notification.service';

@Injectable()
export class OrderService {
  constructor(
    @InjectRepository(Product)
    private readonly productRepository: Repository<Product>,
    @InjectRepository(Order)
    private readonly orderRepository: Repository<Order>,
    @InjectRepository(OrderItem)
    private readonly orderItemRepository: Repository<OrderItem>,
    private readonly notificationService: NotificationService,
    private readonly dataSource: DataSource,
  ) {}

  async getAllOrders(customerId: number, getOrdersQuery: GetOrdersQueryDto) {
    const { status, cursor } = getOrdersQuery;

    const orders = await this.orderRepository.find({
      where: {
        customer: { id: customerId },
        ...(status && { status }),
        ...(cursor && { createdAt: LessThan(new Date(cursor)) }),
      },
      relations: {
        items: {
          product: {
            seller: true,
          },
        },
      },
      select: {
        items: {
          id: true,
          quantity: true,
          product: {
            id: true,
            name: true,
            imageKey: true,
            originalPrice: true,
            isDiscount: true,
            discountPrice: true,
            seller: {
              shopName: true,
            },
          },
        },
      },
      order: {
        createdAt: 'DESC',
      },
      take: 5 + 1,
    });

    const hasNextPage = orders.length > 5;
    const data = hasNextPage ? orders.slice(0, 5) : orders;
    const nextCursor = hasNextPage ? data[data.length - 1].createdAt : null;

    return {
      data,
      nextCursor,
    };
  }

  async getAllSellerOrders(
    sellerId: number,
    getOrdersQuery: GetOrdersQueryDto,
  ) {
    const { status, cursor } = getOrdersQuery;

    const orders = await this.orderRepository.find({
      where: {
        seller: { id: sellerId },
        ...(status && { status }),
        ...(cursor && { createdAt: LessThan(new Date(cursor)) }),
      },
      relations: {
        items: {
          product: true,
        },
      },
      select: {
        items: {
          id: true,
          quantity: true,
          product: {
            name: true,
            imageKey: true,
            originalPrice: true,
            isDiscount: true,
            discountPrice: true,
          },
        },
      },
      order: {
        createdAt: 'DESC',
      },
      take: 2 + 1,
    });

    const hasNextPage = orders.length > 2;
    const data = hasNextPage ? orders.slice(0, 2) : orders;
    const nextCursor = hasNextPage ? data[data.length - 1].createdAt : null;

    return {
      data,
      nextCursor,
    };
  }

  async createOrder(customerId: number, createOrderDto: CreateOrderDto) {
    const { items, sellerId } = createOrderDto;

    const productIds = items.map((i) => i.productId);

    return this.orderRepository.manager
      .transaction(async (manager) => {
        // SELECT không lock -> nhiều transaction cùng đọc được giá trị stockQuantity giống nhau
        const products = await manager.find(Product, {
          where: { id: In(productIds) },
          lock: { mode: 'pessimistic_write' },
        });

        const productMap = new Map(products.map((p) => [p.id, p]));

        // Check đủ tồn kho dựa trên giá trị vừa SELECT (không lock nên có thể stale)
        for (const item of items) {
          const product = productMap.get(item.productId)!;

          if (product.stockQuantity < item.quantity) {
            throw new BadRequestException('Sản phẩm không còn đủ hàng');
          }
        }

        let totalAmount = 0;
        const itemsToCreate = items.map((item) => {
          const product = productMap.get(item.productId)!;
          const price = product.isDiscount
            ? product.discountPrice
            : product.originalPrice;

          totalAmount += price * item.quantity;

          return {
            product,
            quantity: item.quantity,
          };
        });

        const order = manager.create(Order, {
          customer: { id: customerId },
          seller: { id: sellerId },
          totalAmount,
          status: OrderStatus.ORDERED,
        });
        await manager.save(order);

        const orderItems = itemsToCreate.map((item) =>
          manager.create(OrderItem, { ...item, order }),
        );
        await manager.save(orderItems);

        // UPDATE dựa trên giá trị đã đọc ở trên (product.stockQuantity), không phải decrement atomic
        for (const item of items) {
          const product = productMap.get(item.productId)!;
          await manager.decrement(
            Product,
            { id: product.id },
            'stockQuantity',
            item.quantity,
          );
        }

        const cart = await manager.findOne(Cart, {
          where: { user: { id: customerId } },
        });

        if (cart) {
          await manager.delete(CartItem, {
            cart: { id: cart.id },
            product: { id: In(productIds) },
          });
        }

        const notification = manager.create(Notification, {
          type: NotificationType.NEW_ORDER,
          userId: sellerId,
          order,
        });
        const savedNotification = await manager.save(notification);

        return { savedNotification };
      })
      .then(({ savedNotification }) => {
        this.notificationService.notifyNewOrder(sellerId, savedNotification);

        return {
          success: true,
          message: 'Đã đặt đơn thành công!',
        };
      });
  }

  async confirmOrder(orderId: number) {
    const order = await this.orderRepository.findOne({
      where: {
        id: orderId,
      },
      relations: {
        items: {
          product: true,
        },
      },
    });

    if (!order) {
      throw new NotFoundException('Đơn hàng không tồn tại');
    }

    const queryRunner = this.dataSource.createQueryRunner();
    await queryRunner.connect();
    await queryRunner.startTransaction();

    try {
      await queryRunner.manager.update(
        Order,
        { id: orderId },
        { status: OrderStatus.CONFIRMED },
      );

      for (const item of order.items) {
        await queryRunner.manager.decrement(
          Product,
          { id: item.product.id },
          'stockQuantity',
          item.quantity,
        );

        await queryRunner.manager.increment(
          Product,
          { id: item.product.id },
          'soldQuantity',
          item.quantity,
        );
      }

      await queryRunner.commitTransaction();
    } catch (err) {
      await queryRunner.rollbackTransaction();
      throw err;
    } finally {
      await queryRunner.release();
    }

    return {
      success: true,
      message: 'Xác nhận đơn hàng thành công',
    };
  }

  async shipOrder(orderId: number) {
    const order = await this.orderRepository.findOneBy({
      id: orderId,
    });

    if (!order) {
      throw new NotFoundException('Đơn hàng không tồn tại');
    }

    if (order.status !== OrderStatus.CONFIRMED) {
      throw new BadRequestException(
        'Đơn hàng này đang ở trạng thái không khả thi',
      );
    }

    await this.orderRepository.update(
      { id: orderId },
      { status: OrderStatus.SHIPPED },
    );

    return {
      success: true,
      message: 'Nhận đơn hàng thành công',
    };
  }

  async deliverOrder(orderId: number) {
    const order = await this.orderRepository.findOneBy({
      id: orderId,
    });

    if (!order) {
      throw new NotFoundException('Đơn hàng không tồn tại');
    }

    if (order.status !== OrderStatus.SHIPPED) {
      throw new BadRequestException(
        'Đơn hàng này đang ở trạng thái không khả thi',
      );
    }

    await this.orderRepository.update(orderId, {
      status: OrderStatus.DELIVERED,
      shippedAt: new Date(),
    });

    return {
      success: true,
      message: 'Giao đơn hàng thành công',
    };
  }

  async receiveOrder(orderId: number) {
    const order = await this.orderRepository.findOneBy({
      id: orderId,
    });

    if (!order) {
      throw new NotFoundException('Đơn hàng không tồn tại');
    }

    await this.orderRepository.update(
      { id: orderId },
      { status: OrderStatus.COMPLETED },
    );

    return {
      success: true,
      message: 'Hoàn tất đơn hàng thành công',
    };
  }

  async getUnreviewedProducts(orderId: number, customerId: number) {
    const order = await this.orderRepository.findOneBy({
      id: orderId,
    });

    if (!order) {
      throw new NotFoundException('Đơn hàng không tồn tại');
    }

    return this.orderItemRepository
      .createQueryBuilder('orderItem')
      .innerJoin('orderItem.product', 'product')
      .innerJoin('orderItem.order', 'order')
      .leftJoin(
        'reviews',
        'review',
        'review.product_id = product.id AND review.customer_id = :customerId',
        { customerId },
      )
      .where('orderItem.order_id = :orderId', { orderId })
      .andWhere('order.customer_id = :customerId', { customerId }) // đảm bảo đơn hàng thuộc về user này
      .andWhere('review.id IS NULL') // chưa có review nào
      .select([
        'product.id AS id',
        'product.name AS name',
        'product.imageKey AS imageKey',
      ])
      .getRawMany();
  }
}

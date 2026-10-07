import { IsDateString, IsOptional } from 'class-validator';
import { OrderStatus } from '../entity/order.entity';

export class GetOrdersQueryDto {
  @IsOptional()
  @IsDateString()
  cursor?: string;

  @IsOptional()
  status?: OrderStatus;
}

import { Type } from 'class-transformer';
import {
  IsArray,
  ArrayMinSize,
  ValidateNested,
  IsInt,
  Min,
  IsNotEmpty,
} from 'class-validator';

class OrderItemDto {
  @IsInt()
  productId: number;

  @IsInt()
  @Min(1)
  quantity: number;
}

export class CreateOrderDto {
  @IsArray()
  @ArrayMinSize(1)
  @ValidateNested({ each: true })
  @Type(() => OrderItemDto)
  items: OrderItemDto[];

  @IsInt()
  @IsNotEmpty()
  sellerId: number;
}

import { IsNumber, Min } from 'class-validator';

export class AddToCartDto {
  @IsNumber()
  @Min(1)
  quantity: number;
}

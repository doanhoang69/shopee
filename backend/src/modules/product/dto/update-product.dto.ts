import { IsBoolean, IsNumber, IsOptional, IsString } from 'class-validator';

export class UpdateProductDto {
  @IsNumber()
  @IsOptional()
  categoryId: number;

  @IsString()
  @IsOptional()
  name: string;

  @IsString()
  @IsOptional()
  description: string;

  @IsNumber()
  @IsOptional()
  originalPrice: number;

  @IsBoolean()
  @IsOptional()
  isDiscount: boolean;

  @IsOptional()
  discountPrice: number;

  @IsNumber()
  @IsOptional()
  stockQuantity: number;
}

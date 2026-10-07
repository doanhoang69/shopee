import {
  IsString,
  IsNotEmpty,
  IsBoolean,
  IsOptional,
  IsNumber,
} from 'class-validator';
import { Transform, Type } from 'class-transformer';

export class DisplayProductDto {
  @Type(() => Number)
  @IsNumber()
  @IsNotEmpty()
  categoryId: number;

  @IsString()
  @IsNotEmpty()
  name: string;

  @Type(() => Number)
  @IsNumber()
  @IsNotEmpty()
  originalPrice: number;

  @Transform(({ value }) => {
    if (typeof value === 'boolean') return value;
    if (value === 'true') return true;
    if (value === 'false') return false;
    return value;
  })
  @IsBoolean()
  @IsNotEmpty()
  isDiscount: boolean;

  @IsOptional()
  @Type(() => Number)
  @IsNumber()
  discountPrice: number;

  @Type(() => Number)
  @IsNumber()
  @IsNotEmpty()
  stockQuantity: number;
}

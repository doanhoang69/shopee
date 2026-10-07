import { IsIn, IsOptional, IsInt, Min, IsString } from 'class-validator';
import { Type } from 'class-transformer';

export class GetProductsDto {
  @IsOptional()
  @Type(() => Number)
  @IsInt()
  categoryId?: number;

  @IsOptional()
  @Type(() => Number)
  @IsInt()
  sellerId?: number;

  @IsOptional()
  @IsString()
  search?: string;

  @IsOptional()
  @IsIn(['price', 'sales', 'time'])
  sortBy?: 'price' | 'sales' | 'time';

  @IsOptional()
  @IsIn(['asc', 'desc'])
  order?: 'asc' | 'desc';

  @Type(() => Number)
  @IsInt()
  @Min(1)
  page: number;
}

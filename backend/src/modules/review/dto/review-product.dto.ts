import { Transform, Type } from 'class-transformer';
import { IsString, IsOptional, IsInt, MaxLength } from 'class-validator';

export class ReviewProductDto {
  @IsOptional()
  @Transform(({ value }) =>
    typeof value === 'string' && value.trim() === ''
      ? undefined
      : value?.trim(),
  )
  @IsString()
  @MaxLength(500, { message: 'Nội dung đánh giá tối đa 500 ký tự' })
  content?: string;

  @Type(() => Number)
  @IsInt({ message: 'Số sao phải là số nguyên' })
  rating: number;
}

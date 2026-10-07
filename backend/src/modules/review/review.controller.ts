import {
  Body,
  Controller,
  Get,
  Param,
  ParseIntPipe,
  Post,
  Query,
  UploadedFile,
  UseGuards,
} from '@nestjs/common';
import { ReviewService } from './review.service';
import { Roles } from '../../shared/decorators/roles.decorator';
import { UserRole } from '../../shared/enum/user-role.enum';
import { RolesGuard } from '../auth/roles.guard';
import { ReviewProductDto } from './dto/review-product.dto';
import { AuthGuard } from '../auth/auth.guard';
import { Authorized } from '../../shared/decorators/authorized.decorator';
import { UploadImage } from '../../shared/decorators/upload-image.decorator';

@UseGuards(AuthGuard)
@Controller('products/:productId/reviews')
export class ReviewController {
  constructor(private readonly reviewService: ReviewService) {}

  @Roles(UserRole.CUSTOMER)
  @UseGuards(RolesGuard)
  @UploadImage('image')
  @Post()
  reviewProduct(
    @Authorized() userId: number,
    @Param('productId', ParseIntPipe) productId: number,
    @Body() reviewPayload: ReviewProductDto,
    @UploadedFile() image?: Express.Multer.File,
  ) {
    return this.reviewService.reviewProduct(
      userId,
      productId,
      reviewPayload,
      image,
    );
  }

  @Get()
  getAllReviews(
    @Query('page', ParseIntPipe) page: number,
    @Param('productId', ParseIntPipe) productId: number,
  ) {
    return this.reviewService.getAllReviews(productId, page);
  }
}

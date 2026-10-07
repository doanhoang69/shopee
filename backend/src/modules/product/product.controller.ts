import {
  Body,
  Controller,
  Delete,
  Get,
  Param,
  ParseIntPipe,
  Patch,
  Post,
  Query,
  UploadedFile,
  UseGuards,
} from '@nestjs/common';
import { ProductService } from './product.service';
import { DisplayProductDto } from './dto/display-product.dto';
import { AuthGuard } from '../auth/auth.guard';
import { UpdateProductDto } from './dto/update-product.dto';
import { GetProductsDto } from './dto/get-products.dto';
import { Roles } from '../../shared/decorators/roles.decorator';
import { UserRole } from '../../shared/enum/user-role.enum';
import { RolesGuard } from '../auth/roles.guard';
import { Authorized } from '../../shared/decorators/authorized.decorator';
import { UploadImage } from '../../shared/decorators/upload-image.decorator';

@UseGuards(AuthGuard)
@Controller('products')
export class ProductController {
  constructor(private readonly productService: ProductService) {}

  @Get()
  getAllProducts(@Query() query: GetProductsDto) {
    return this.productService.getAllProducts(query);
  }

  @Get(':productId')
  getProductById(@Param('productId', ParseIntPipe) productId: number) {
    return this.productService.getProductById(productId);
  }

  @Roles(UserRole.SELLER)
  @UseGuards(RolesGuard)
  @UploadImage('image')
  @Post()
  displayNewProduct(
    @Authorized() userId: number,
    @Body() product: DisplayProductDto,
    @UploadedFile() image: Express.Multer.File,
  ) {
    return this.productService.displayNewProduct(userId, product, image);
  }

  @Roles(UserRole.SELLER)
  @UseGuards(RolesGuard)
  @Patch(':id')
  @UploadImage('image')
  updateProduct(
    @Authorized() userId: number,
    @Param('id', ParseIntPipe) productId: number,
    @Body() updateDto: UpdateProductDto,
    @UploadedFile() image?: Express.Multer.File,
  ) {
    return this.productService.updateProduct(
      userId,
      productId,
      updateDto,
      image,
    );
  }

  @Roles(UserRole.SELLER)
  @UseGuards(RolesGuard)
  @Delete(':productId')
  deleteProduct(
    @Authorized() userId: number,
    @Param('productId', ParseIntPipe) id: number,
  ) {
    return this.productService.deleteProduct(userId, id);
  }
}

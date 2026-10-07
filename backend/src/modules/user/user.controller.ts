import {
  BadRequestException,
  Body,
  Controller,
  Get,
  Patch,
  Post,
  UploadedFile,
  UseGuards,
} from '@nestjs/common';
import { UserService } from './user.service';
import { AuthGuard } from '../auth/auth.guard';
import { UpdateUserDto } from './dto/update-user.dto';
import { CreateUserDto } from './dto/create-user.dto';
import { Authorized } from '../../shared/decorators/authorized.decorator';
import { UploadImage } from '../../shared/decorators/upload-image.decorator';

@Controller('users')
export class UserController {
  constructor(private readonly userService: UserService) {}

  @UseGuards(AuthGuard)
  @Get('me')
  getMe(@Authorized() userId: number) {
    return this.userService.getMe(userId);
  }

  @Post()
  createUser(@Body() createUserDto: CreateUserDto) {
    return this.userService.createUser(createUserDto);
  }

  @UseGuards(AuthGuard)
  @UploadImage('image')
  @Post('avatar')
  uploadAvatar(
    @Authorized() userId: number,
    @UploadedFile() image: Express.Multer.File,
  ) {
    if (!image) {
      throw new BadRequestException('Vui lòng chọn file ảnh');
    }
    return this.userService.uploadAvatar(userId, image);
  }

  @UseGuards(AuthGuard)
  @Patch()
  updateProfile(@Authorized() userId: number, @Body() dto: UpdateUserDto) {
    return this.userService.updateUser(userId, dto);
  }
}

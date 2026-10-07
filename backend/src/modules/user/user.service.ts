import {
  ConflictException,
  Injectable,
  NotFoundException,
} from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { User } from './entity/user.entity';
import { StorageService } from '../../core/storage/storage.service';
import { v4 as uuidv4 } from 'uuid';
import { CreateUserDto } from './dto/create-user.dto';
import { UpdateUserDto } from './dto/update-user.dto';
import bcrypt from 'bcrypt';
import { extname } from 'path';

@Injectable()
export class UserService {
  constructor(
    @InjectRepository(User)
    private readonly userRepository: Repository<User>,
    private readonly storageService: StorageService,
  ) {}

  async getMe(userId: number) {
    const user = await this.userRepository.findOne({
      where: {
        id: userId,
      },
      select: {
        id: true,
        email: true,
        firstName: true,
        lastName: true,
        shopName: true,
        phone: true,
        address: true,
        avatarKey: true,
        role: true,
      },
    });

    if (!user) {
      throw new NotFoundException('Người dùng không tồn tại');
    }

    return user;
  }

  async createUser(createUserDto: CreateUserDto) {
    const { email, password } = createUserDto;
    const user = await this.userRepository.findOneBy({ email });

    if (user) {
      throw new ConflictException('Email đã được đăng ký');
    }

    const hashedPassword = await bcrypt.hash(password, 10);

    const newUser = this.userRepository.create({
      ...createUserDto,
      password: hashedPassword,
    });

    await this.userRepository.save(newUser);

    return {
      success: true,
      message: 'Create user successfully!',
    };
  }

  async uploadAvatar(userId: number, image: Express.Multer.File) {
    const user = await this.userRepository.findOneBy({ id: userId });

    if (!user) {
      throw new NotFoundException('Không tìm thấy khách hàng');
    }

    const oldAvatarKey = user.avatarKey;
    const imageKey = this.generateImageKey('avatars', image.originalname);

    await this.storageService.upload(image.buffer, imageKey, image.mimetype);

    try {
      await this.userRepository.update(userId, { avatarKey: imageKey });
    } catch (err) {
      await this.storageService.delete(imageKey);
      throw err;
    }

    if (oldAvatarKey) {
      await this.storageService.delete(oldAvatarKey);
    }

    return {
      success: true,
      message: 'Thay đổi avatar thành công',
    };
  }

  async updateUser(userId: number, updateUserDto: UpdateUserDto) {
    const user = await this.userRepository.findOneBy({ id: userId });

    if (!user) {
      throw new NotFoundException('Không tìm thấy người dùng');
    }

    await this.userRepository.update(user.id, { ...user, ...updateUserDto });

    return {
      success: true,
      message: 'Cập nhật hồ sơ thành công',
    };
  }

  private generateImageKey(folder: string, originalName: string): string {
    const ext = extname(originalName).toLowerCase(); // .jpg, .png...
    const fileName = `${uuidv4()}${ext}`;
    return `${folder}/${fileName}`;
  }
}

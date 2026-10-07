import { Module } from '@nestjs/common';
import { UserService } from './user.service';
import { UserController } from './user.controller';
import { TypeOrmModule } from '@nestjs/typeorm';
import { User } from './entity/user.entity';
import { AuthModule } from '../auth/auth.module';
import { JwtService } from '@nestjs/jwt';
import { StorageService } from '../../core/storage/storage.service';

@Module({
  imports: [TypeOrmModule.forFeature([User]), AuthModule],
  controllers: [UserController],
  providers: [UserService, JwtService, StorageService],
})
export class UserModule {}

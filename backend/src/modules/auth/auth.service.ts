import {
  Injectable,
  NotFoundException,
  UnauthorizedException,
} from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import { JwtService } from '@nestjs/jwt';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import bcrypt from 'bcrypt';
import { LoginUser } from './dtos/login-user.dto';
import { User } from '../user/entity/user.entity';

@Injectable()
export class AuthService {
  constructor(
    @InjectRepository(User)
    private readonly userRepository: Repository<User>,
    private readonly jwtService: JwtService,
    private readonly configService: ConfigService,
  ) {}

  async login(loginUser: LoginUser) {
    const { email, password } = loginUser;

    const user = await this.userRepository.findOneBy({ email });

    if (!user) {
      throw new NotFoundException('Người dùng không tồn tại');
    }

    const isPwdCorrect = await bcrypt.compare(password, user.password);

    if (!isPwdCorrect) {
      throw new UnauthorizedException('Mật khẩu không chính xác!');
    }

    const payload = { sub: user.id, role: user.role };

    const accessToken = await this.jwtService.signAsync(payload, {
      secret: this.configService.getOrThrow('ACCESS_TOKEN_SECRET'),
      expiresIn: this.configService.getOrThrow('ACCESS_TOKEN_EXPIRES_IN'),
    });

    const refreshToken = await this.jwtService.signAsync(payload, {
      secret: this.configService.getOrThrow('REFRESH_TOKEN_SECRET'),
      expiresIn: this.configService.getOrThrow('REFRESH_TOKEN_EXPIRES_IN'),
    });

    return {
      accessToken,
      refreshToken,
    };
  }

  async refreshToken(refreshToken: string) {
    try {
      const { sub, role } = await this.jwtService.verifyAsync(refreshToken, {
        secret: this.configService.getOrThrow<string>('REFRESH_TOKEN_SECRET'),
      });

      const newAccessToken = await this.jwtService.signAsync(
        { sub, role },
        {
          secret: this.configService.getOrThrow<string>('ACCESS_TOKEN_SECRET'),
          expiresIn: this.configService.getOrThrow('ACCESS_TOKEN_EXPIRES_IN'),
        },
      );

      return { accessToken: newAccessToken };
    } catch (err) {
      throw new UnauthorizedException('Invalid refresh token');
    }
  }
}

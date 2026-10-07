import {
  CanActivate,
  ExecutionContext,
  Injectable,
  UnauthorizedException,
} from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import { JwtService } from '@nestjs/jwt';
import { Request } from 'express';
import { JwtPayload } from './interfaces/jwt-payload.interface';

@Injectable()
export class AuthGuard implements CanActivate {
  constructor(
    private readonly jwtService: JwtService,
    private readonly configService: ConfigService,
  ) {}

  async canActivate(context: ExecutionContext): Promise<boolean> {
    const request = context.switchToHttp().getRequest<Request>();
    const token = this.extractTokenFromCookie(request);

    if (!token) throw new UnauthorizedException('Access token is missing!');

    try {
      const payload = await this.jwtService.verifyAsync<JwtPayload>(token, {
        secret: this.configService.getOrThrow<string>('ACCESS_TOKEN_SECRET'),
      });

      request['user'] = payload;
      return true;
    } catch (error) {
      throw new UnauthorizedException('Invalid or expired token!');
    }
  }

  private extractTokenFromCookie(req: Request): string | undefined {
    return req.cookies?.accessToken;
  }
}

import {
  Body,
  Controller,
  HttpCode,
  Post,
  Req,
  Res,
  UnauthorizedException,
  UseGuards,
} from '@nestjs/common';
import { AuthService } from './auth.service';
import { AuthGuard } from './auth.guard';
import type { Request, Response } from 'express';
import { LoginUser } from './dtos/login-user.dto';

@Controller('auth')
export class AuthController {
  constructor(private readonly authService: AuthService) {}
  @HttpCode(200)
  @Post('login')
  async login(@Body() loginUser: LoginUser, @Res() res: Response) {
    const { accessToken, refreshToken } =
      await this.authService.login(loginUser);

    res.cookie('accessToken', accessToken, {
      httpOnly: true,
      secure: true,
      sameSite: 'strict',
      maxAge: 15 * 60 * 1000,
    });

    res.cookie('refreshToken', refreshToken, {
      httpOnly: true,
      secure: true,
      sameSite: 'strict',
      maxAge: 7 * 24 * 60 * 60 * 1000,
    });

    return res.json({
      success: true,
      message: 'Login successfully',
    });
  }

  @UseGuards(AuthGuard)
  @HttpCode(200)
  @Post('logout')
  logout(@Res() res: Response) {
    res.clearCookie('accessToken', {
      httpOnly: true,
      secure: true,
      sameSite: 'strict',
    });

    res.clearCookie('refreshToken', {
      httpOnly: true,
      secure: true,
      sameSite: 'strict',
    });

    res.json({
      success: true,
      message: 'Đăng xuất tài khoản thành công',
    });
  }

  @HttpCode(200)
  @Post('refresh')
  async refresh(@Req() req: Request, @Res() res: Response) {
    const refreshToken = req.cookies?.refreshToken;

    if (!refreshToken) {
      throw new UnauthorizedException('Refresh token is missing');
    }

    const { accessToken } = await this.authService.refreshToken(refreshToken);

    res.cookie('accessToken', accessToken, {
      httpOnly: true,
      secure: true,
      sameSite: 'strict',
      maxAge: 15 * 60 * 1000,
    });

    return res.json({ message: 'Access token refreshed successfully' });
  }
}

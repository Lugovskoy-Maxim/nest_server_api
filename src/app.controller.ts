import {
  Body,
  Controller,
  Get,
  HttpException,
  HttpStatus,
  Post,
  Req,
  Res,
  UseGuards,
} from '@nestjs/common';
import { Response } from 'express';
import { AuthGuard } from '@nestjs/passport';
import { AuthService } from './auth/auth.service';
import { RegisterUserDto } from './users/dto/register-user.dto';
import { AppService } from './app.service';

interface CustomRequest extends Request {
  user: any;
}

@Controller()
export class AppController {
  constructor(
    private readonly authService: AuthService,
    private readonly appService: AppService,
  ) {}

  @UseGuards(AuthGuard('local'))
  @Post('auth/login')
  async login(
    @Req() req: CustomRequest,
    @Res({ passthrough: true }) res: Response,
  ) {
    const { access_token } = await this.authService.login(req.user);

    res.cookie('access_token', access_token, {
      httpOnly: true,
      secure: process.env.NODE_ENV === 'production',
      maxAge: 24 * 60 * 60 * 1000, // 24 часа
      sameSite: 'strict',
      path: '/',
    });

    return { success: true, access_token };
  }

  @Post('auth/register')
  async register(
    @Body() body: RegisterUserDto,
    @Res({ passthrough: true }) res: Response,
  ) {
    try {
      if (!body?.login || !body?.password) {
        throw new HttpException(
          'Не все обязательные поля заполнены.',
          HttpStatus.BAD_REQUEST,
        );
      }

      const { access_token } = await this.authService.register(body);

      res.cookie('access_token', access_token, {
        httpOnly: true,
        secure: process.env.NODE_ENV === 'production',
        maxAge: 24 * 60 * 60 * 1000, // 24 часа
        sameSite: 'strict',
        path: '/',
      });

      return { success: true, message: 'Регистрация прошла успешно' };
    } catch (error) {
      if (error instanceof HttpException) {
        throw error;
      }
      throw new HttpException(
        error instanceof Error ? error.message : 'Ошибка при регистрации',
        HttpStatus.INTERNAL_SERVER_ERROR,
      );
    }
  }

  @Get('auth/logout')
  async logout(@Res({ passthrough: true }) res: Response) {
    res.clearCookie('access_token');
    return { success: true, message: 'Вы вышли из аккаунта' };
  }

  @Get('statistics')
  async getStatistics() {
    try {
      return await this.appService.getGlobalStatistics();
    } catch (error) {
      if (error instanceof HttpException) {
        throw error;
      }
      throw new HttpException(
        'Не удалось удалить профиль',
        HttpStatus.INTERNAL_SERVER_ERROR,
      );
    }
  }
}

import {
  Controller,
  Get,
  Put,
  Delete,
  Body,
  Param,
  UseGuards,
  Req,
  HttpException,
  HttpStatus,
} from '@nestjs/common';
import { JwtAuthGuard } from '../auth/jwt-auth.guard';
import { UsersService } from './users.service';
import { UpdateUserDto } from './dto/update-user.dto';
import { RequestWithUser } from './interfaces/request-with-user.interface';
import { RolesGuard } from '../auth/roles.guard';
import { Roles } from '../auth/roles.decorator';

@Controller('users')
@UseGuards(JwtAuthGuard, RolesGuard)
export class UsersController {
  constructor(private readonly usersService: UsersService) {}

  // Получить данные текущего пользователя
  @Get('me')
  async getProfile(@Req() req: RequestWithUser) {
    try {
    const userId = req.user.sub; 
      const user = await this.usersService.findById(userId);
      if (!user) {
        throw new HttpException('Пользователь не найден', HttpStatus.NOT_FOUND);
      }
      return user;
    } catch (error) {
      if (error instanceof HttpException) {
        throw error;
      }
      throw new HttpException(
        'Не удалось получить данные пользователя',
        HttpStatus.INTERNAL_SERVER_ERROR,
      );
    }
  }

    // Получить всех пользователей (только для админов)
  @Get('all')
  @Roles('admin')
  async getAllUsers() {
    try {
      return await this.usersService.findAll();
    } catch (error) {
      throw new HttpException(
        'Не удалось получить список пользователей',
        HttpStatus.INTERNAL_SERVER_ERROR,
      );
    }
  }

  // Получить данные любого пользователя 
  @Get(':id')
  async getUser(@Param('id') id: string) {
    try {
      const user = await this.usersService.findById(id);
      if (!user) {
        throw new HttpException('Пользователь не найден', HttpStatus.NOT_FOUND);
      }
      return user;
    } catch (error) {
      if (error instanceof HttpException) {
        throw error;
      }
      throw new HttpException(
        'Ошибка при получении пользователя',
        HttpStatus.INTERNAL_SERVER_ERROR,
      );
    }
  }

  // Обновить данные пользователя
  @Put('me')
  async updateProfile(
    @Req() req: RequestWithUser,
    @Body() updateUserDto: UpdateUserDto,
  ) {
    try {
      const userId = req.user.sub;
      const updatedUser = await this.usersService.update(userId, updateUserDto);
      if (!updatedUser) {
        throw new HttpException('Пользователь не найден', HttpStatus.NOT_FOUND);
      }
      return updatedUser;
    } catch (error) {
      if (error instanceof HttpException) {
        throw error;
      }
      throw new HttpException(
        'Не удалось обновить данные',
        HttpStatus.BAD_REQUEST,
      );
    }
  }

  // Удалить профиль
  @Delete(':id')
  async deleteProfile(@Req() req: RequestWithUser) {
    try {
      const userId = req.user.sub;
      const deletedUser = await this.usersService.delete(userId);
      if (!deletedUser) {
        throw new HttpException('Пользователь не найден', HttpStatus.NOT_FOUND);
      }
      return { message: 'Профиль успешно удален' };
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
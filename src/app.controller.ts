import {
  Body,
  Controller,
  Get,
  HttpException,
  HttpStatus,
  Post,
  Req,
  UseGuards,
} from '@nestjs/common';
import { AuthGuard } from '@nestjs/passport';
import { AuthService } from './auth/auth.service';
import { JwtAuthGuard } from './auth/jwt-auth.guard';
import { UserDocument } from './schemas/user.schema';
import { RegisterUserDto } from './users/dto/registerUser.dto';

interface CustomRequest extends Request {
  user: any;
}
@Controller()
export class AppController {
  constructor(private readonly authService: AuthService) {} // Внедрение зависимости AuthService

  @UseGuards(AuthGuard('local'))
  @Post('auth/login')
  async login(@Req() req: CustomRequest) {
    return this.authService.login(req.user);
  }

  @Post('auth/register')
  async register(@Body() body: RegisterUserDto) {
    try {
      if (!body || !body.username || !body.password) {
        throw new HttpException('Не все обязательные поля заполнены.', HttpStatus.BAD_REQUEST);
      }
      
      return this.authService.register(body);
    } catch (error) {
      throw new HttpException('Не все обязательные поля заполнены.', HttpStatus.BAD_REQUEST);
    }
  }

  @UseGuards(JwtAuthGuard)
  @Get('profile')
  getProfile(@Req() req: any) {
    return req.user;
  }
}

// curl -X POST http://localhost:3001/auth/register -d ' {"username": "john", "password": "changeme"}' -H "Content-Type: application/json"
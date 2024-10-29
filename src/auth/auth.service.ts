import { Injectable } from '@nestjs/common';
import { JwtService } from '@nestjs/jwt';
import { UsersService } from 'src/users/users.service';
import * as bcrypt from 'bcrypt';
import { UserDocument } from 'src/schemas/user.schema';
import { LoginResponse, RegisterUserDto } from 'src/users/dto/registerUser.dto';

@Injectable()
export class AuthService {
  constructor(
    private readonly jwtService: JwtService,
    private usersService: UsersService,
  ) {}

  private async hashPassword(password: string): Promise<string> {
    const saltRounds = 10;
    const salt = await bcrypt.genSalt(saltRounds);
    return await bcrypt.hash(password, salt);
  }


  async login(user: any): Promise<LoginResponse> {
    const payload = { username: user.username, sub: user.id };
    console.log(payload);
    const accessToken = this.jwtService.sign(
      { payload },
      { secret: process.env.JWT_SECRET },
    );

    const response: LoginResponse = {
      access_token: accessToken,
      userId: user.id,
      username: user.username,
      email: user.email,
    };

    return response;
  }

  async register(user: RegisterUserDto): Promise<LoginResponse> {
    try {
      const hashedPassword = await this.hashPassword(user.password);
      const createdUser = await this.usersService.create({
        ...user,
        // username: user.username,
        // email: user.email,
        password: hashedPassword,
      });
      console.log(createdUser);
      return this.login(createdUser);
    } catch (error) {
      throw error;
    }
  }

  async validateUser(username: string, password: string): Promise<any> {
    const user = await this.usersService.findOne(username);
    if (user == undefined) {
      throw new Error('Пользователь не найден');
    }

    const isValid = await user.comparePassword(password);
    if (isValid) {
      const { password, ...result } = user.toObject(); // Используем toObject() для удаления пароля перед возвратом
      return result;
    } else {
      throw new Error('Неверный пароль');
    }
  }
}

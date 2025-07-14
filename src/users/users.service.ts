import { Injectable, NotFoundException } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Model, Types } from 'mongoose';
import { User, UserDocument } from '../schemas/user.schema';
import { UpdateUserDto } from './dto/update-user.dto';
import { RegisterUserDto } from './dto/register-user.dto';

@Injectable()
export class UsersService {
  constructor(
    @InjectModel(User.name) private readonly userModel: Model<UserDocument>,
  ) {}

  // Создание нового пользователя
  async create(createUserDto: RegisterUserDto): Promise<UserDocument> {
    const createdUser = new this.userModel(createUserDto);
    return await createdUser.save();
  }

  // Поиск по логину или email
  async findOneByLoginOrEmail(login: string): Promise<UserDocument | null> {
    return this.userModel
      .findOne({
        $or: [{ login }, { email: login }],
      })
      .select('+password')
      .exec();
  }

  // Поиск только по логину
  async findOneByLogin(login: string): Promise<UserDocument | null> {
    return this.userModel.findOne({ login });
  }

  // Поиск по ID
  async findById(userId: string): Promise<User | null> {
    if (!userId) {
      return null;
    }
    return this.userModel.findById(userId).select('-password').exec();
  }

  // Получение всех пользователей (с пагинацией)
  async findAll(
    skip = 0,
    limit = 10,
  ): Promise<{ users: User[]; count: number }> {
    const [users, count] = await Promise.all([
      this.userModel.find().skip(skip).limit(limit).select('-password').exec(),
      this.userModel.countDocuments().exec(),
    ]);
    return { users, count };
  }

  // Обновление пользователя
  async update(id: string, updateUserDto: UpdateUserDto): Promise<User> {
    const updatedUser = await this.userModel
      .findByIdAndUpdate(id, updateUserDto, { new: true })
      .select('-password')
      .exec();

    if (!updatedUser) {
      throw new NotFoundException(`User with ID ${id} not found`);
    }

    return updatedUser;
  }

  // Удаление пользователя
  async delete(id: string): Promise<User> {
    const deletedUser = await this.userModel
      .findByIdAndDelete(id)
      .select('-password')
      .exec();

    if (!deletedUser) {
      throw new NotFoundException(`User with ID ${id} not found`);
    }

    return deletedUser;
  }

  // Поиск по email
  async findByEmail(email: string): Promise<UserDocument | null> {
    return this.userModel.findOne({ email });
  }

  // Активация email
  async markEmailAsVerified(email: string): Promise<User> {
    const updatedUser = await this.userModel
      .findOneAndUpdate({ email }, { verifiedEmail: true }, { new: true })
      .exec();

    if (!updatedUser) {
      throw new NotFoundException(`Пользователь с ${email} не найден`);
    }

    return updatedUser;
  }

  // Обновление пароля
  async updatePassword(
    userId: string,
    newPassword: string,
  ): Promise<User | null> {
    return this.userModel.findByIdAndUpdate(
      userId,
      { password: newPassword },
      { new: true },
    );
  }

  // Получение общего количества пользователей
  async getTotalCount(): Promise<number> {
    try {
      return await this.userModel.countDocuments().exec();
    } catch (error) {
      throw new Error('Ошибка при получении общего количества пользователей');
    }
  }

  // Получение количества активных пользователей (с примером критерия активности)
  async getActiveCount(): Promise<number> {
    try {
      const thirtyDaysAgo = new Date(
        new Date().setDate(new Date().getDate() - 30),
      );

      const activeUsers = await this.userModel
        .find({
          lastActiveAt: { $gte: thirtyDaysAgo },
        })
        .select('_id lastActiveAt')
        .lean();
      return activeUsers.length;
    } catch (error) {
      throw new Error('Ошибка при получении количества активных пользователей');
    }
  }
}

import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import * as mongoose from 'mongoose';
import { IsEmail, IsDate, IsNotEmpty, ValidateNested } from 'class-validator';
import { Type } from 'class-transformer';
import * as bcrypt from 'bcrypt';

export interface IUser {
  firstName: string;
  lastName?: string; 
  birthday: Date;
  email: string;
  confirmationToken: string | null;
  confirmed: boolean;
  password: Password;
}

export type UserDocument = mongoose.Document & IUser;

@Schema({ timestamps: true }) // тайм штамп для добавление записей создано и обновлено
export class User implements IUser {
  @IsNotEmpty({ message: 'Требуется обязательное значение - Имя' })
  @Prop()
  firstName: string;

  @Prop({ required: false })
  lastName?: string; 

  @IsDate()
  @Prop({ type: Date })
  birthday: Date;

  @IsNotEmpty({ message: 'Требуется обязательное значение - Почта' })
  @IsEmail({}, { message: 'Почта имеет не верный формат' })
  @Prop({ unique: true })
  email: string;

  @Prop({ default: null })
  confirmationToken: string | null;

  @Prop({ default: false })
  confirmed: boolean;

  @IsNotEmpty({ message: 'Требуется обязательное значение - Пароль' })
  @Type(() => Password)
  @ValidateNested()
  @Prop({ required: true })
  password: Password;

  // Хеширование пароля перед сохранением
  async hashPassword() {
	const salt = await bcrypt.genSalt();
	this.password.value = await bcrypt.hash(this.password.value, salt);
  }
}

class Password {
  @IsNotEmpty({ message: 'Требуется обязательное значение - Пароль' })
  @Prop({ required: true })
  value: string;
}

export const UserSchema = SchemaFactory.createForClass(User);

// Предварительное сохранение хука для хеширования пароля
UserSchema.pre<UserDocument>('save', async function (next) {
  if (this.isModified('password.value')) {
    const salt = await bcrypt.genSalt();
    this.password.value = await bcrypt.hash(this.password.value, salt);
  }
  next();
});
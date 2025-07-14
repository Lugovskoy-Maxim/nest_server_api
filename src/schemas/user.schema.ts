import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import { Document, Types } from 'mongoose';
import * as bcrypt from 'bcrypt';

export type UserDocument = User &
  Document & {
    _id: Types.ObjectId;
    comparePassword(password: string): Promise<boolean>;
    createdAt: Date;
    updatedAt: Date;
  };

@Schema({
  timestamps: true,
  versionKey: false,
  toJSON: {
    virtuals: true,
    transform: function (_doc, ret) {
      // Безопасное удаление полей
      if ('password' in ret) {
        delete ret.password;
      }
      return ret;
    },
  },
})
export class User {
  @Prop({
    type: String,
    required: true,
    unique: true,
    minlength: 3,
    maxlength: 30,
    match: /^[a-zA-Z0-9_]+$/, // Только буквы, цифры и подчёркивания
  })
  login: string;

  @Prop({
    type: String,
    unique: true,
    sparse: true, // Позволяет иметь null для уникальных полей
    validate: {
      validator: (v: string) => /.+@.+\..+/.test(v),
      message: 'Некорректный email',
    },
  })
  email?: string;

  @Prop({
    type: String,
    required: true,
    select: false, //Не возвращается в запросах по умолчанию
  })
  password: string;

  @Prop({
    type: String,
    trim: true,
    maxlength: 50,
  })
  firstName?: string;

  @Prop({
    type: String,
    trim: true,
    maxlength: 50,
  })
  lastName?: string;

  @Prop({
    type: Boolean,
    default: false,
  })
  verifiedEmail: boolean;

  @Prop({
    type: String,
    match: /^\+?[0-9]{10,15}$/,
    default: null,
  })
  phoneNumber?: string | null;

  @Prop({
    type: Date,
    validate: {
      validator: (v: Date) => v < new Date(),
      message: 'Дата рождения не может быть в будущем',
    },
  })
  birthday?: Date;

  @Prop({
    type: String,
    match: /^(https?:\/\/).+\.(jpg|jpeg|png|gif)$/i,
  })
  avatar?: string;

  @Prop({
    type: String,
    enum: ['male', 'female', null],
    default: null,
  })
  sex?: 'male' | 'female' | null;

  @Prop({
    type: [String],
    default: ['user'],
    enum: ['user', 'admin', 'moderator'],
  })
  roles: string[];

  // Метод для сравнения паролей
  async comparePassword(password: string): Promise<boolean> {
    return bcrypt.compare(password, this.password);
  }

  @Prop({ index: true, default: Date.now })
  lastActiveAt: Date;
}

export const UserSchema = SchemaFactory.createForClass(User);

// Добавляем индексы для часто используемых полей
UserSchema.index({ login: 1 }, { unique: true });
UserSchema.index({ email: 1 }, { unique: true, sparse: true });
UserSchema.index({ roles: 1 });

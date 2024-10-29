import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import { Document } from 'mongoose';
import * as bcrypt from 'bcrypt';

export type UserDocument = User & Document;

@Schema({ timestamps: true, versionKey: false })
export class User {
  @Prop({ required: true, unique: true })
  username: string;

  @Prop({ unique: true })
  email?: string;

  @Prop({
    default: false,
  })
  verifiedEmail: boolean;

  @Prop({ required: true })
  password: string;

  @Prop()
  birthday?: Date;

  @Prop({ default: ['user'] })
  roles: string[];

  async comparePassword(password: string): Promise<boolean> {
    return await bcrypt.compare(password, this.password);
  }
}

export const UserSchema = SchemaFactory.createForClass(User);

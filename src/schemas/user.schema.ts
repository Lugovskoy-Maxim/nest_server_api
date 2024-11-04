import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import { Document } from 'mongoose';
import * as bcrypt from 'bcrypt';

export type UserDocument = User & Document;

@Schema({ timestamps: true, versionKey: false })
export class User {
  @Prop({ required: true, unique: true })
  login: string;

  @Prop({ unique: true })
  email?: string;

  @Prop({ required: true })
  password: string;

  @Prop({})
  firstName?: string;

  @Prop({})
  lastName?: string;

  @Prop({
    default: false,
  })
  verifiedEmail: boolean;

  @Prop()
  phoneNumber?: string;

  @Prop()
  birthday?: Date;

  @Prop()
  avatar?: string;

  @Prop()
  sex?: 'male' | 'female';

  @Prop({ default: ['user'] } )
  roles?: string[];

  async comparePassword(password: string): Promise<boolean> {
    return await bcrypt.compare(password, this.password);
  }
}

export const UserSchema = SchemaFactory.createForClass(User);

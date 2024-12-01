import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import { Document } from 'mongoose';
import { Transaction } from './transaction.schema';

export type WalletDocument = Wallet & Document;

@Schema({ timestamps: true, versionKey: false })
export class Wallet {
  @Prop()
  users: string[];

  @Prop({ required: true })
  name: string;

  @Prop({ default: 0 })
  balance: number;

  @Prop({ default: 'RUB' })
  currency?: string;

  @Prop()
  owner: string;

  @Prop([{ type: Transaction }])
  transactions: Transaction[];

  @Prop({ default: false })
  isDeleted?: boolean;

  @Prop({ default: false })
  isDefault?: boolean;

  @Prop({ default: false })
  isPublic?: boolean;
}

export const WalletDocument = SchemaFactory.createForClass(Wallet);

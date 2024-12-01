import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import { Document } from 'mongoose';

export type TransactionDocument = Transaction & Document;

@Schema({ timestamps: true, versionKey: false })
export class Transaction {
  @Prop({ required: true })
  amount: number;

  @Prop({ default: 'RUB' })
  currency?: string;

  @Prop({ default: ['other'] })
  category?: string;

  @Prop({ required: true })
  date: Date;

  @Prop()
  description?: string;

  @Prop({ enum: ['income', 'expense'], required: true })
  type: 'income' | 'expense';

  //Источник дохода/расхода
  @Prop({ default: 'unknown' })
  source?: string;

  @Prop([{ type: String }])
  files?: string[];

  @Prop()
  owner: string;
}

export const TransactionSchema = SchemaFactory.createForClass(Transaction);

import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import * as mongoose from 'mongoose';
import { Priority } from '../shared/shared.enum';

@Schema({ timestamps: true })
export class Board extends mongoose.Document {
  @Prop({
    required: true,
  })
  title: string;
  @Prop({
    required: true,
  })
  description: string;
  @Prop()
  icon: string;

  @Prop([{ type: mongoose.Types.ObjectId, ref: 'User', default: [] }])
  members: mongoose.Types.ObjectId[];

  @Prop({ type: [], default: [] })
  status: {
    status_key: { type: string; unique: true };
    index: number;
    title: string;
  }[];

  @Prop({ type: [], default: [] })
  objectifs: {
    objectif_key: { type: string; unique: true };
    title: { type: string };
    description: { type: string };
    due_date: { type: Date };
    status: { type: string };
    priority: { type: string; enum: Priority; default: Priority.LOW };
    labels: [{ type: mongoose.Types.ObjectId; ref: 'Labels'; default: [] }];
    assign: { type: mongoose.Types.ObjectId; ref: 'User' };
  }[];
}

export const BoardSchema = SchemaFactory.createForClass(Board);

export interface BoardInterface extends mongoose.Document {
  id: string;
  title: string;
  description: string;
  icon?: string;
  members?: any;
  status?: any;
  objectifs?: any;
}
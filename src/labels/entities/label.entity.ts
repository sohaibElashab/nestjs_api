import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import * as mongoose from 'mongoose';

export const LabelsSchema = new mongoose.Schema({
  title: { type: String, required: true },
  boardId: { type: mongoose.Types.ObjectId, ref: 'Board', required: true },
});

export interface LabelsInterface extends mongoose.Document {
  id: string;
  title: string;
  boardId: string;
}
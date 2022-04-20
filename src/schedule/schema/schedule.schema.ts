import { Category } from '../../categories/schemas/category.schema';
import { BaseSchema } from 'src/models/base-document.schema';
import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import { Document } from 'mongoose';
import { Post } from 'src/posts/schemas/post.schema';
import mongoose from 'mongoose';

export type ScheduleDocument = Schedule & Document;

@Schema()
export class Schedule {
  @Prop({ required: true })
  buyerId: string;

  @Prop({ required: true })
  vendorId: string;

  @Prop({ type: mongoose.Schema.Types.ObjectId, ref: 'Post' })
  postId: Post;

  @Prop({ required: true })
  time: Date;

  @Prop({ required: true })
  date: Date;

  @Prop({ required: true })
  rating: number;
}

export const ScheduleSchema = SchemaFactory.createForClass(Schedule);

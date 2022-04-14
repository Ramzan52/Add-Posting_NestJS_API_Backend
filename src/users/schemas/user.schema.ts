import { Schedule } from './../../schedule/schema/post.schedule.schema';
import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import { Document } from 'mongoose';

export type UserDocument = User & Document;

@Schema()
export class User {
  @Prop({ required: true })
  name: string;

  @Prop({ required: true })
  username: string;

  @Prop()
  phoneNumber: string;

  @Prop({ required: true })
  salt: string;

  @Prop({ required: true })
  hash: string;

  @Prop()
  ratings: [
    {
      postId: string;
      scheduleId: string;
      rating: number;
    },
  ];

  @Prop()
  avgRating: number;

  @Prop()
  resetPasswordCode: string;

  @Prop()
  IsResetVerified: boolean = false;

  registerCode: number;

  @Prop()
  isUserVerified: boolean;
}

export const UserSchema = SchemaFactory.createForClass(User);

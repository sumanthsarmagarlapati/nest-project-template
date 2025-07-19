import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import { Document } from 'mongoose';

@Schema({
  timestamps: true,versionKey:false  // This will add createdAt and updatedAt automatically
})

export class User extends Document {
  @Prop({ required: true, maxlength: 30 })
  first_name: string;

  @Prop({ required: true, maxlength: 30 })
  last_name: string;

  @Prop({ required: true, maxlength: 30, unique: true })
  username: string;

  @Prop({ required: true, maxlength: 100 })
  email: string;

  @Prop({ required: true, maxlength: 10 })
  mobile: string;

  @Prop({ required: true })
  password: string;

  @Prop({ required: true, unique: true })
  code: string;
}

export const UserSchema = SchemaFactory.createForClass(User);

// Create compound index for unique username and email
UserSchema.index({ username: 1, email: 1 }, { unique: true });

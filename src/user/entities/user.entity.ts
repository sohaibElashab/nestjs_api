import * as mongoose from 'mongoose';
import * as bcrypt from 'bcrypt';
import { Role } from '../shared/shared.enum';

export const UserSchema = new mongoose.Schema({
  email: {
    type: String,
    match: [
      /^\w+([\.-]?\w+)*@\w+([\.-]?\w+)*(\.\w{2,3})+$/,
      'Please fill a valid email address',
    ],
    required: true,
    unique: true,
  },
  username: { type: String, required: true },
  password: { type: String, required: true },
  role: { type: String, required: true, enum: Role, default: Role.DEV },
  token: { type: String },
});
UserSchema.pre('save', async function (next) {
  try {
    if (!this.isModified('password')) {
      return next();
    }
    const hashed = await bcrypt.hash(this['password'], 10);
    this['password'] = hashed;
    return next();
  } catch (err) {
    return next(err);
  }
});
export interface UserInterface extends mongoose.Document {
  id: string;
  email: string;
  username: string;
  password: string;
  role: string;
}

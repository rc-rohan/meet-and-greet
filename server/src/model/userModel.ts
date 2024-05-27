import { model, Schema } from 'mongoose';
import bcrypt from 'bcryptjs';

const SALT_ROUND = 10;

interface User {
  _id: string, // take it directly from the ID generated from the mongoose
  firstName: string,
  lastName: string,
  email: string,
  password: string,
  confirmPassword: string | undefined,
  avatar: string,
  role: string,
  passwordChangedAt: Date,
  passwordResetToken: string,
  passwordResetTokenExpiresAt: Date,
}

const schema = new Schema<User>({
  firstName: {
    type: String,
    required: true,
    trim: true,
  },
  lastName: {
    type: String,
    required: true,
  },
  email: {
    type: String,
    lowercase: true,
    required: true,
    unique: true,
  },
  password: {
    type: String,
    minLength: 8,
    required: true,
    select: false, // any user cannot cannot select the password from DB and it will not be shwon to any user.
  },
  confirmPassword: {
    type: String,
    required: [true, 'Please confirm your password'], // todo add the validator in the frontend
    validator(value: String) {
      // custom validator
      // return value === this.password; todo check the accessibility error here.
    },
    message: 'Confirm Password does not match with Password',
  },
  avatar: {
    type: String,
    default: '', // set the first Letter of the user as avatar or else of the the user enters the profile pic then set that as the avatar.
  },
  role: { // todo role is not required in the user schema as we will make the admin in room .
    type: String,
    default: 'User',
    of: ['Admin', 'User'],
  },
  passwordChangedAt: Date,
  passwordResetToken: String,
  passwordResetTokenExpiresAt: Date,
});

// don't use arrow function inside it. Check docs for ref
schema.pre('save', async function hashUserPassword(next) {
  // converts the password to hash code and then stores it 
  if (!this.isModified('password')) {
    next();
  }
  const salt = await bcrypt.genSalt(SALT_ROUND);
  this.password = await bcrypt.hash(this.password, salt);

  this.confirmPassword = undefined;
  next();
});

const UserSchema = model<User>('User', schema);
export { UserSchema };

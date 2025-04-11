
import mongoose, { Schema } from 'mongoose';
import { User } from '../interfaces/user.interface';
import bcrypt from 'bcrypt';

const userSchema = new Schema(
  {

    username: {
        type: String,
        required: true,
        maxlength: [50, 'user name should not exceed 50 characters'],
        minlength: [5, 'user name should be at lest 8 characters']
    },
    email: {
      type: String,
      required: [true, 'Email is required'],
      unique: true,
      trim: true,
      lowercase: true,
      validate: {
        validator: function(v: string) {
          return /^\w+([\.-]?\w+)*@\w+([\.-]?\w+)*(\.\w{2,3})+$/.test(v);
        },
        message: props => `${props.value} is not a valid email address!`
      }
    },
    password: {
      type: String,
      required: [true, 'Password is required'],
      trim: true,
      minlength: [8, 'Password must be at least 8 characters'],
      validate: {
        validator: function(v: string) {
          // At least 8 chars, one uppercase, one lowercase, one number
          return /^(?=.*\d)(?=.*[a-z])(?=.*[A-Z])(?=.*[a-zA-Z]).{8,}$/.test(v);
        },
        message: 'Password must contain at least one uppercase letter, one lowercase letter, and one number'
      }
    }
  },
  {
    timestamps: true,
    versionKey: false
  }
);

// Hash password before saving
userSchema.pre('save', async function(next) {
  // Only hash the password if it's modified or new
  if (!this.isModified('password')) return next();
  
  try {
    const salt = await bcrypt.genSalt(10);
    this.password = await bcrypt.hash(this.password, salt);
    next();
  } catch (error: any) {
    next(error);
  }
});

// Method to compare passwords
userSchema.methods.comparePassword = async function(candidatePassword: string): Promise<boolean> {
  return bcrypt.compare(candidatePassword, this.password);
};

const User = mongoose.model<User>('User', userSchema);
export default User;

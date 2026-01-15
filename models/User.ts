import mongoose, { Document } from 'mongoose';

export interface IUser extends Document {
    email: string;
    password: string;
    otp?: string;
    otpExpires?: Date;
    isVerified: boolean;
    role?: string;
}

const userSchema = new mongoose.Schema<IUser>({
    email: { type: String, required: true, unique: true },
    password: { type: String, required: true },
    otp: { type: String },
    otpExpires: { type: Date },
    isVerified: { type: Boolean, default: false },
    role: { type: String, default: 'user' },
}, { timestamps: true });

export default mongoose.model<IUser>('User', userSchema);
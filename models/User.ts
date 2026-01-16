import mongoose, { Document } from 'mongoose';

export interface IUser extends Document {
    username: string;
    email: string;
    universityName?: string;
    phoneNumber?: string;
    password: string;
    otp?: string;
    otpExpires?: Date;
    isVerified: boolean;
    role?: string;
}

const userSchema = new mongoose.Schema<IUser>({
    username : { type: String, required: true, unique: true },
    email: { type: String, required: true, unique: true },
    universityName: { type: String, required: false },
    phoneNumber: { type: String, unique: true, required: true },
    password: { type: String, required: true },
    otp: { type: String },
    otpExpires: { type: Date },
    isVerified: { type: Boolean, default: false },
    role: { type: String, default: 'user' },
}, { timestamps: true });

export default mongoose.model<IUser>('User', userSchema);
import mongoose, { Document, Types } from "mongoose";

export interface IUser extends Document {
  _id: Types.ObjectId;
  username: string;
  email: string;
  universityName?: string;
  phoneNumber?: string;
  password: string;
  otp?: string;
  otpExpires?: Date;
  isVerified: boolean;
  role?: string;
  isEligible?: boolean;
  assignedChallenge?: number;
}

const userSchema = new mongoose.Schema<IUser>(
  {
    username: { type: String, required: true, unique: true },
    email: { type: String, required: true, unique: true },
    universityName: { type: String, required: false },
    phoneNumber: { type: String, unique: true, required: true },
    password: { type: String, required: true },
    otp: { type: String },
    otpExpires: { type: Date },
    isVerified: { type: Boolean, default: false },
    role: { type: String, default: "user" },
    isEligible: { type: Boolean, default: true },
    assignedChallenge: { type: Number, default: null },
  },
  { timestamps: true },
);

export default mongoose.model<IUser>("User", userSchema);

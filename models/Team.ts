import mongoose, { Document, Types } from "mongoose";

export interface ITeamJoinRequest {
  user: Types.ObjectId;
  createdAt: Date;
}

export interface ITeamInvite {
  user: Types.ObjectId;
  invitedBy: Types.ObjectId;
  createdAt: Date;
}

export interface ISolvedMachine {
  machineId: string;
  solvedBy: Types.ObjectId;
  solvedAt: Date;
  points: number;
}

export interface IViewedHint {
  machineId: string;
  hintNumber: number; // 1, 2, or 3
  viewedBy: Types.ObjectId;
  viewedAt: Date;
  pointsDeducted: number;
}

export interface ITeam extends Document {
  name: string;
  owner: Types.ObjectId;
  members: Types.ObjectId[];
  joinRequests: ITeamJoinRequest[];
  invites: ITeamInvite[];
  points: number;
  solvedMachines: ISolvedMachine[];
  viewedHints: IViewedHint[];
  createdAt: Date;
  updatedAt: Date;
}

const teamJoinRequestSchema = new mongoose.Schema<ITeamJoinRequest>(
  {
    user: { type: mongoose.Schema.Types.ObjectId, ref: "User", required: true },
    createdAt: { type: Date, default: Date.now },
  },
  { _id: false }
);

const teamInviteSchema = new mongoose.Schema<ITeamInvite>(
  {
    user: { type: mongoose.Schema.Types.ObjectId, ref: "User", required: true },
    invitedBy: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
      required: true,
    },
    createdAt: { type: Date, default: Date.now },
  },
  { _id: false }
);

const solvedMachineSchema = new mongoose.Schema<ISolvedMachine>(
  {
    machineId: { type: String, required: true },
    solvedBy: { type: mongoose.Schema.Types.ObjectId, ref: "User", required: true },
    solvedAt: { type: Date, default: Date.now },
    points: { type: Number, required: true },
  },
  { _id: false }
);

const viewedHintSchema = new mongoose.Schema<IViewedHint>(
  {
    machineId: { type: String, required: true },
    hintNumber: { type: Number, required: true },
    viewedBy: { type: mongoose.Schema.Types.ObjectId, ref: "User", required: true },
    viewedAt: { type: Date, default: Date.now },
    pointsDeducted: { type: Number, required: true },
  },
  { _id: false }
);

const teamSchema = new mongoose.Schema<ITeam>(
  {
    name: { type: String, required: true, unique: true, trim: true },
    owner: { type: mongoose.Schema.Types.ObjectId, ref: "User", required: true },
    members: [{ type: mongoose.Schema.Types.ObjectId, ref: "User", required: true }],
    joinRequests: { type: [teamJoinRequestSchema], default: [] },
    invites: { type: [teamInviteSchema], default: [] },
    points: { type: Number, default: 0 },
    solvedMachines: { type: [solvedMachineSchema], default: [] },
    viewedHints: { type: [viewedHintSchema], default: [] },
  },
  { timestamps: true }
);

export default mongoose.model<ITeam>("Team", teamSchema);


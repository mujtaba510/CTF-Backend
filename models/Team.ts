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

export interface ITeam extends Document {
  name: string;
  owner: Types.ObjectId;
  members: Types.ObjectId[];
  joinRequests: ITeamJoinRequest[];
  invites: ITeamInvite[];
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

const teamSchema = new mongoose.Schema<ITeam>(
  {
    name: { type: String, required: true, unique: true, trim: true },
    owner: { type: mongoose.Schema.Types.ObjectId, ref: "User", required: true },
    members: [{ type: mongoose.Schema.Types.ObjectId, ref: "User", required: true }],
    joinRequests: { type: [teamJoinRequestSchema], default: [] },
    invites: { type: [teamInviteSchema], default: [] },
  },
  { timestamps: true }
);

export default mongoose.model<ITeam>("Team", teamSchema);

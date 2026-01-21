import mongoose from "mongoose";
import type { IUser } from "../models/User.ts";
import User from "../models/User.ts";
import Team from "../models/Team.ts";
import AppError from "../utils/AppError.ts";

const MAX_TEAM_SIZE = 3;

const toObjectId = (id: string) => {
  if (!mongoose.Types.ObjectId.isValid(id)) {
    throw new AppError("Invalid ID", 400);
  }
  return new mongoose.Types.ObjectId(id);
};

const getTeamStatus = (team: any) => {
  const memberCount = team.members?.length ?? 0;
  const pendingCount =
    (team.joinRequests?.length ?? 0) + (team.invites?.length ?? 0);

  if (memberCount >= MAX_TEAM_SIZE) return "Full";
  if (pendingCount > 0) return "Pending Requests";
  return "Open";
};

const findUsersByIds = async (ids: string[]) => {
  const objectIds = ids.map(toObjectId);
  const users = await User.find({ _id: { $in: objectIds } }).select(
    "_id username email"
  );
  if (users.length !== ids.length) {
    throw new AppError("One or more users not found", 404);
  }
  return users;
};

const ensureNotInAnyTeam = async (userId: string) => {
  const existingTeam = await Team.findOne({ members: toObjectId(userId) }).select(
    "_id"
  );
  if (existingTeam) {
    throw new AppError("User is already in a team", 400);
  }
};

export const listTeams = async (currentUser: IUser) => {
  const teams = await Team.find({})
    .sort({ createdAt: -1 })
    .populate("owner", "_id username")
    .populate("members", "_id username")
    .lean();

  const currentUserId = currentUser._id.toString();

  const mapped = teams.map((t: any) => {
    const status = getTeamStatus(t);
    const isMember = (t.members || []).some(
      (m: any) => m._id.toString() === currentUserId
    );

    const hasPendingJoinRequest = (t.joinRequests || []).some(
      (jr: any) => jr.user?.toString?.() === currentUserId
    );

    const hasInvite = (t.invites || []).some(
      (inv: any) => inv.user?.toString?.() === currentUserId
    );

    return {
      _id: t._id,
      name: t.name,
      owner: t.owner,
      members: t.members,
      status,
      counts: {
        members: t.members?.length ?? 0,
        joinRequests: t.joinRequests?.length ?? 0,
        invites: t.invites?.length ?? 0,
      },
      viewer: {
        isMember,
        hasPendingJoinRequest,
        hasInvite,
        isOwner: t.owner?._id?.toString?.() === currentUserId,
      },
    };
  });

  return { success: true, teams: mapped };
};

export const createTeam = async (
  currentUser: IUser,
  name: string,
  inviteeIds?: string[]
) => {
  await ensureNotInAnyTeam(currentUser._id.toString());

  const normalizedName = name.trim();
  if (!normalizedName) {
    throw new AppError("Team name is required", 400);
  }

  const existingByName = await Team.findOne({ name: normalizedName }).select(
    "_id"
  );
  if (existingByName) {
    throw new AppError("Team name already exists", 400);
  }

  const uniqueInviteeIds = Array.from(new Set(inviteeIds ?? [])).filter(Boolean);

  // Enforce min 2 players intent by requiring at least 1 invite at creation.
  if (uniqueInviteeIds.length < 1) {
    throw new AppError("A team must have at least 2 members. Invite 1 user.", 400);
  }
  if (uniqueInviteeIds.length > 2) {
    throw new AppError("You can invite at most 2 users", 400);
  }

  if (uniqueInviteeIds.some((id) => id === currentUser._id.toString())) {
    throw new AppError("You cannot invite yourself", 400);
  }

  // Ensure invitees exist and are not already in teams
  await findUsersByIds(uniqueInviteeIds);
  for (const inviteeId of uniqueInviteeIds) {
    await ensureNotInAnyTeam(inviteeId);
  }

  const team = await Team.create({
    name: normalizedName,
    owner: currentUser._id,
    members: [currentUser._id],
    invites: uniqueInviteeIds.map((id) => ({
      user: toObjectId(id),
      invitedBy: currentUser._id,
      createdAt: new Date(),
    })),
  });

  return { success: true, teamId: team._id };
};

export const requestToJoin = async (currentUser: IUser, teamId: string) => {
  await ensureNotInAnyTeam(currentUser._id.toString());

  const team = await Team.findById(toObjectId(teamId));
  if (!team) {
    throw new AppError("Team not found", 404);
  }

  if (team.members.length >= MAX_TEAM_SIZE) {
    throw new AppError("Team is full", 400);
  }

  const userId = currentUser._id.toString();
  if (team.members.some((m) => m.toString() === userId)) {
    throw new AppError("You are already a member of this team", 400);
  }

  if (team.joinRequests.some((r) => r.user.toString() === userId)) {
    throw new AppError("Join request already sent", 400);
  }

  if (team.invites.some((i) => i.user.toString() === userId)) {
    throw new AppError("You already have an invite to this team", 400);
  }

  team.joinRequests.push({ user: currentUser._id, createdAt: new Date() });
  await team.save();

  return { success: true, message: "Join request sent" };
};

const ensureMemberCanManage = (team: any, userId: string) => {
  const isMember = team.members.some((m: any) => m.toString() === userId);
  if (!isMember) {
    throw new AppError("Not authorized for this team", 403);
  }
};

export const listJoinRequests = async (currentUser: IUser, teamId: string) => {
  const team = await Team.findById(toObjectId(teamId))
    .populate("joinRequests.user", "_id username")
    .select("_id joinRequests members owner");

  if (!team) throw new AppError("Team not found", 404);

  ensureMemberCanManage(team, currentUser._id.toString());

  return {
    success: true,
    joinRequests: team.joinRequests.map((r: any) => ({
      user: r.user,
      createdAt: r.createdAt,
    })),
  };
};

export const acceptJoinRequest = async (
  currentUser: IUser,
  teamId: string,
  userIdToAccept: string
) => {
  const team = await Team.findById(toObjectId(teamId));
  if (!team) throw new AppError("Team not found", 404);

  ensureMemberCanManage(team, currentUser._id.toString());

  if (team.members.length >= MAX_TEAM_SIZE) {
    throw new AppError("Team is full", 400);
  }

  await ensureNotInAnyTeam(userIdToAccept);

  const idx = team.joinRequests.findIndex(
    (r) => r.user.toString() === userIdToAccept
  );
  if (idx === -1) {
    throw new AppError("Join request not found", 404);
  }

  team.joinRequests.splice(idx, 1);
  team.members.push(toObjectId(userIdToAccept));

  // If the accepted user had an invite too, clear it.
  team.invites = team.invites.filter(
    (i) => i.user.toString() !== userIdToAccept
  );

  await team.save();
  return { success: true, message: "Join request accepted" };
};

export const rejectJoinRequest = async (
  currentUser: IUser,
  teamId: string,
  userIdToReject: string
) => {
  const team = await Team.findById(toObjectId(teamId));
  if (!team) throw new AppError("Team not found", 404);

  ensureMemberCanManage(team, currentUser._id.toString());

  const before = team.joinRequests.length;
  team.joinRequests = team.joinRequests.filter(
    (r) => r.user.toString() !== userIdToReject
  );

  if (team.joinRequests.length === before) {
    throw new AppError("Join request not found", 404);
  }

  await team.save();
  return { success: true, message: "Join request rejected" };
};

export const inviteUser = async (
  currentUser: IUser,
  teamId: string,
  userIdToInvite: string
) => {
  const team = await Team.findById(toObjectId(teamId));
  if (!team) throw new AppError("Team not found", 404);

  ensureMemberCanManage(team, currentUser._id.toString());

  if (team.members.length >= MAX_TEAM_SIZE) {
    throw new AppError("Team is full", 400);
  }

  if (team.members.some((m) => m.toString() === userIdToInvite)) {
    throw new AppError("User is already in the team", 400);
  }

  if (team.invites.some((i) => i.user.toString() === userIdToInvite)) {
    throw new AppError("Invite already sent", 400);
  }

  if (team.joinRequests.some((r) => r.user.toString() === userIdToInvite)) {
    throw new AppError("User already requested to join", 400);
  }

  await ensureNotInAnyTeam(userIdToInvite);

  team.invites.push({
    user: toObjectId(userIdToInvite),
    invitedBy: currentUser._id,
    createdAt: new Date(),
  });
  await team.save();

  return { success: true, message: "Invite sent" };
};

export const listMyInvites = async (currentUser: IUser) => {
  const userId = currentUser._id.toString();

  const teams = await Team.find({ "invites.user": toObjectId(userId) })
    .populate("owner", "_id username")
    .populate("invites.invitedBy", "_id username")
    .select("_id name owner invites members")
    .lean();

  const invites = teams
    .map((t: any) => {
      const inv = (t.invites || []).find((i: any) => i.user.toString() === userId);
      if (!inv) return null;
      return {
        team: { _id: t._id, name: t.name, owner: t.owner },
        invitedBy: inv.invitedBy,
        createdAt: inv.createdAt,
        teamMemberCount: t.members?.length ?? 0,
      };
    })
    .filter(Boolean);

  return { success: true, invites };
};

export const acceptInvite = async (currentUser: IUser, teamId: string) => {
  await ensureNotInAnyTeam(currentUser._id.toString());

  const team = await Team.findById(toObjectId(teamId));
  if (!team) throw new AppError("Team not found", 404);

  if (team.members.length >= MAX_TEAM_SIZE) {
    throw new AppError("Team is full", 400);
  }

  const userId = currentUser._id.toString();
  const inviteIndex = team.invites.findIndex((i) => i.user.toString() === userId);
  if (inviteIndex === -1) {
    throw new AppError("Invite not found", 404);
  }

  team.invites.splice(inviteIndex, 1);
  team.members.push(currentUser._id);

  // Clear any join request they may have had.
  team.joinRequests = team.joinRequests.filter((r) => r.user.toString() !== userId);

  await team.save();
  return { success: true, message: "Invite accepted" };
};

export const declineInvite = async (currentUser: IUser, teamId: string) => {
  const team = await Team.findById(toObjectId(teamId));
  if (!team) throw new AppError("Team not found", 404);

  const userId = currentUser._id.toString();
  const before = team.invites.length;
  team.invites = team.invites.filter((i) => i.user.toString() !== userId);
  if (team.invites.length === before) {
    throw new AppError("Invite not found", 404);
  }

  await team.save();
  return { success: true, message: "Invite declined" };
};

export const leaveTeam = async (currentUser: IUser, teamId: string) => {
  const team = await Team.findById(toObjectId(teamId));
  if (!team) throw new AppError("Team not found", 404);

  const userId = currentUser._id.toString();
  const isMember = team.members.some((m) => m.toString() === userId);
  if (!isMember) {
    throw new AppError("You are not a member of this team", 400);
  }

  const wasOwner = team.owner.toString() === userId;

  // Creator/owner should delete the team, not "leave" it.
  if (wasOwner) {
    throw new AppError("Only the team creator can delete the team", 403);
  }

  team.members = team.members.filter((m) => m.toString() !== userId);
  team.joinRequests = team.joinRequests.filter((r) => r.user.toString() !== userId);
  team.invites = team.invites.filter((i) => i.user.toString() !== userId);

  await team.save();

  return {
    success: true,
    message: "Left team",
    dissolved: false,
  };
};

export const deleteTeam = async (currentUser: IUser, teamId: string) => {
  const team = await Team.findById(toObjectId(teamId)).select("_id owner");
  if (!team) throw new AppError("Team not found", 404);

  const userId = currentUser._id.toString();
  if (team.owner.toString() !== userId) {
    throw new AppError("Only the team creator can delete the team", 403);
  }

  await Team.deleteOne({ _id: team._id });
  return { success: true, message: "Team deleted" };
};

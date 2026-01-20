import type { Request, Response, NextFunction } from "express";
import asyncHandler from "../middleware/asyncHandler.ts";
import validate from "../middleware/validate.ts";
import * as teamManager from "../managers/teamManager.ts";
import { createTeamSchema, inviteUserSchema } from "../schemaValidation/team.schema.ts";

export const listTeams = asyncHandler(
  async (req: Request, res: Response, next: NextFunction) => {
    const result = await teamManager.listTeams(req.user!);
    res.status(200).json(result);
  }
);

export const createTeam = [
  validate(createTeamSchema),
  asyncHandler(async (req: Request, res: Response) => {
    const { name, inviteeIds } = req.body;
    const result = await teamManager.createTeam(req.user!, name, inviteeIds);
    res.status(201).json(result);
  }),
];

export const requestToJoin = asyncHandler(
  async (req: Request, res: Response, next: NextFunction) => {
    const { teamId } = req.params;
    const result = await teamManager.requestToJoin(req.user!, teamId);
    res.status(200).json(result);
  }
);

export const listJoinRequests = asyncHandler(
  async (req: Request, res: Response, next: NextFunction) => {
    const { teamId } = req.params;
    const result = await teamManager.listJoinRequests(req.user!, teamId);
    res.status(200).json(result);
  }
);

export const acceptJoinRequest = asyncHandler(
  async (req: Request, res: Response, next: NextFunction) => {
    const { teamId, userId } = req.params;
    const result = await teamManager.acceptJoinRequest(req.user!, teamId, userId);
    res.status(200).json(result);
  }
);

export const rejectJoinRequest = asyncHandler(
  async (req: Request, res: Response, next: NextFunction) => {
    const { teamId, userId } = req.params;
    const result = await teamManager.rejectJoinRequest(req.user!, teamId, userId);
    res.status(200).json(result);
  }
);

export const inviteUser = [
  validate(inviteUserSchema),
  asyncHandler(async (req: Request, res: Response) => {
    const { teamId } = req.params;
    const { userId } = req.body;
    const result = await teamManager.inviteUser(req.user!, teamId, userId);
    res.status(200).json(result);
  }),
];

export const listMyInvites = asyncHandler(
  async (req: Request, res: Response, next: NextFunction) => {
    const result = await teamManager.listMyInvites(req.user!);
    res.status(200).json(result);
  }
);

export const acceptInvite = asyncHandler(
  async (req: Request, res: Response, next: NextFunction) => {
    const { teamId } = req.params;
    const result = await teamManager.acceptInvite(req.user!, teamId);
    res.status(200).json(result);
  }
);

export const declineInvite = asyncHandler(
  async (req: Request, res: Response, next: NextFunction) => {
    const { teamId } = req.params;
    const result = await teamManager.declineInvite(req.user!, teamId);
    res.status(200).json(result);
  }
);

export const leaveTeam = asyncHandler(
  async (req: Request, res: Response, next: NextFunction) => {
    const { teamId } = req.params;
    const result = await teamManager.leaveTeam(req.user!, teamId);
    res.status(200).json(result);
  }
);

export const deleteTeam = asyncHandler(
  async (req: Request, res: Response, next: NextFunction) => {
    const { teamId } = req.params;
    const result = await teamManager.deleteTeam(req.user!, teamId);
    res.status(200).json(result);
  }
);

export default {
  listTeams,
  createTeam,
  requestToJoin,
  listJoinRequests,
  acceptJoinRequest,
  rejectJoinRequest,
  inviteUser,
  listMyInvites,
  acceptInvite,
  declineInvite,
  leaveTeam,
  deleteTeam,
};

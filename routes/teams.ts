import express from "express";
const router = express.Router();

import authenticate from "../middleware/authenticate.ts";
import authorize from "../middleware/authorize.ts";
import teamController from "../controllers/teamController.ts";

router.get("/", authenticate, authorize("user", "admin"), teamController.listTeams);

router.post(
  "/",
  authenticate,
  authorize("user", "admin"),
  ...(teamController.createTeam as any)
);

router.get(
  "/invites",
  authenticate,
  authorize("user", "admin"),
  teamController.listMyInvites
);

router.post(
  "/:teamId/join-requests",
  authenticate,
  authorize("user", "admin"),
  teamController.requestToJoin
);

router.get(
  "/:teamId/join-requests",
  authenticate,
  authorize("user", "admin"),
  teamController.listJoinRequests
);

router.post(
  "/:teamId/join-requests/:userId/accept",
  authenticate,
  authorize("user", "admin"),
  teamController.acceptJoinRequest
);

router.post(
  "/:teamId/join-requests/:userId/reject",
  authenticate,
  authorize("user", "admin"),
  teamController.rejectJoinRequest
);

router.post(
  "/:teamId/invites",
  authenticate,
  authorize("user", "admin"),
  ...(teamController.inviteUser as any)
);

router.post(
  "/:teamId/invites/accept",
  authenticate,
  authorize("user", "admin"),
  teamController.acceptInvite
);

router.post(
  "/:teamId/invites/decline",
  authenticate,
  authorize("user", "admin"),
  teamController.declineInvite
);

router.post(
  "/:teamId/leave",
  authenticate,
  authorize("user", "admin"),
  teamController.leaveTeam
);

router.delete(
  "/:teamId",
  authenticate,
  authorize("user", "admin"),
  teamController.deleteTeam
);

export default router;

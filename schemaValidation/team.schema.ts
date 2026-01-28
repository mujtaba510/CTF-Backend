import { z } from "zod";

export const createTeamSchema = z.object({
  name: z
    .string()
    .min(2, { message: "Team name must be at least 2 characters." })
    .max(50, { message: "Team name must be at most 50 characters." }),
  inviteeIds: z
    .array(z.string().min(1))
    .max(2, { message: "You can invite at most 2 users at creation." })
    .optional(),
});

export const inviteUserSchema = z.object({
  userId: z.string().min(1, { message: "User ID is required." }),
});


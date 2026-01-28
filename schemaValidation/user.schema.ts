import { z } from "zod";
import mongoose from "mongoose";

const getUserProfileSchema = z.object({
  id: z.string().refine((val) => mongoose.Types.ObjectId.isValid(val), {
    message: "Invalid user ID",
  }),
});

export { getUserProfileSchema };


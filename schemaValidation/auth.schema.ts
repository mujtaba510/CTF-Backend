import { z } from "zod";

const signupSchema = z.object({
  username: z.string().min(1, { message: "Username is required." }),
  email: z
    .email({ message: "A valid email is required." }),
  password: z
    .string()
    .min(6, { message: "Password must be at least 6 characters." }),

  universityName: z.string().min(1, { message: "University name is required." }),
  // phoneNumber: z
  //   .string()
  //   .min(11, { message: "Phone number must be at least 11 digits."})
})

const otpSchema = z.object({
  email: z.email({ message: "A valid email is required." }),
  otp: z.string().length(6, { message: "OTP must be exactly 6 digits." }),
});

const loginSchema = z.object({
  email: z.email({ message: "A valid email is required." }),
  password: z.string().min(1, { message: "Password is required." }),
});

const forgetPasswordSchema = z.object({
  email: z.email({ message: "A valid email is required." }),
});

const resetPasswordSchema = z.object({
  email: z.email({ message: "A valid email is required." }),
  newPassword: z
    .string()
    .min(6, { message: "Password must be at least 6 characters." }),
});

const changePasswordSchema = z.object({
  currentPassword: z
    .string()
    .min(1, { message: "Current password is required." }),
  newPassword: z
    .string()
    .min(6, { message: "New password must be at least 6 characters." }),
});

export {
  signupSchema,
  otpSchema,
  loginSchema,
  forgetPasswordSchema,
  resetPasswordSchema,
  changePasswordSchema,
};
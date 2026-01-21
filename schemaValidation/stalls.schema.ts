import { z } from "zod";

export const createStallsSubmissionSchema = z.object({
    name: z
        .string({
            message: "Name is required",
        })
        .min(2, "Name must be at least 2 characters")
        .max(100, "Name must not exceed 100 characters")
        .trim(),
    email: z
        .string({
            message: "Email is required",
        })
        .email("Please enter a valid email address")
        .trim()
        .toLowerCase(),
    companyOrUniversity: z
        .string({
            message: "Company or University is required",
        })
        .min(2, "Company or University must be at least 2 characters")
        .max(200, "Company or University must not exceed 200 characters")
        .trim(),
    productName: z
        .string({
            message: "Product name is required",
        })
        .min(2, "Product name must be at least 2 characters")
        .max(150, "Product name must not exceed 150 characters")
        .trim(),
    productDescription: z
        .string({
            message: "Product description is required",
        })
        .min(10, "Product description must be at least 10 characters")
        .max(1000, "Product description must not exceed 1000 characters")
        .trim(),
    phoneNumber: z
        .string({
            message: "Phone number is required",
        })
        .min(11, "Phone number must be at least 11 digits")
        .max(11, "Phone number must not exceed 11 digits")
        .regex(/^[0-9+\-\s()]+$/, "Please enter a valid phone number")
        .trim(),
    teamMembers: z
        .string({
            message: "Team members information is required",
        })
        .min(2, "Team members must be at least 2 characters")
        .max(500, "Team members must not exceed 500 characters")
        .trim(),
});

export type CreateStallsSubmissionInput = z.infer<
    typeof createStallsSubmissionSchema
>;

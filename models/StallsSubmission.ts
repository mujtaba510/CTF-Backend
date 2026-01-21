import mongoose, { Schema, Document } from "mongoose";

export interface IStallsSubmission extends Document {
    name: string;
    email: string;
    companyOrUniversity: string;
    productName: string;
    productDescription: string;
    phoneNumber: string;
    teamMembers: string;
    submissionDate: Date;
}

const StallsSubmissionSchema = new Schema<IStallsSubmission>(
    {
        name: {
            type: String,
            required: [true, "Name is required"],
            trim: true,
        },
        email: {
            type: String,
            required: [true, "Email is required"],
            trim: true,
            lowercase: true,
            match: [/\S+@\S+\.\S+/, "Please enter a valid email"],
        },
        companyOrUniversity: {
            type: String,
            required: [true, "Company or University is required"],
            trim: true,
        },
        productName: {
            type: String,
            required: [true, "Product name is required"],
            trim: true,
        },
        productDescription: {
            type: String,
            required: [true, "Product description is required"],
            trim: true,
        },
        phoneNumber: {
            type: String,
            required: [true, "Phone number is required"],
            trim: true,
        },
        teamMembers: {
            type: String,
            required: [true, "Team members information is required"],
            trim: true,
        },
        submissionDate: {
            type: Date,
            default: Date.now,
        },
    },
    {
        timestamps: true,
    }
);

const StallsSubmission = mongoose.model<IStallsSubmission>(
    "StallsSubmission",
    StallsSubmissionSchema
);

export default StallsSubmission;

import mongoose, { Schema, Document } from "mongoose";

export interface IJob extends Document {
  userId: string;
  company: string;
  role: string;
  status: "applied" | "interview" | "rejected" | "offer";
  jobDescription: string;
  note?: string;
  appliedDate: Date;
  createdAt: Date;
  updatedAt: Date;
}

const jobSchema = new Schema<IJob>(
  {
    userId: {
      type: String,
      required: true,
      ref: "User",
      index: true,
    },
    company: {
      type: String,
      required: true,
      trim: true,
    },
    role: {
      type: String,
      required: true,
      trim: true,
    },
    status: {
      type: String,
      enum: ["applied", "interview", "rejected", "offer"],
      default: "applied",
      index: true,
    },
    jobDescription: {
      type: String,
      required: true,
    },
    note: {
      type: String,
    },
    appliedDate: {
      type: Date,
      default: Date.now,
      index: true,
      required: true,
    },
  },
  { timestamps: true },
);

const Job = mongoose.models.Job || mongoose.model<IJob>("Job", jobSchema);

export default Job;

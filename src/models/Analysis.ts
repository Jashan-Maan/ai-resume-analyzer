import mongoose, { Schema, Document } from "mongoose";

export interface IAnalysis extends Document {
  userId: string;
  atsScore: number;
  summary: string;
  strengths: string[];
  weaknesses: string[];
  missingKeywords: string[];
  suggestions: {
    priority: "high" | "medium" | "low";
    suggestion: string;
  }[];
  sectionsFound: {
    experience: boolean;
    education: boolean;
    skills: boolean;
    projects: boolean;
    summary: boolean;
  };
  createdAt: Date;
  updatedAt: Date;
}

const analysisSchema = new Schema<IAnalysis>(
  {
    userId: {
      type: String,
      required: true,
      ref: "User",
    },
    atsScore: {
      type: Number,
      required: true,
    },
    summary: {
      type: String,
      required: true,
    },
    strengths: {
      type: [String],
      default: [],
    },
    weaknesses: {
      type: [String],
      default: [],
    },
    missingKeywords: {
      type: [String],
      default: [],
    },
    suggestions: {
      type: [
        {
          priority: {
            type: String,
            enum: ["high", "medium", "low"],
            required: true,
          },
          suggestion: {
            type: String,
            required: true,
          },
        },
      ],
      default: [],
    },
    sectionsFound: {
      type: {
        experience: { type: Boolean, required: true },
        education: { type: Boolean, required: true },
        skills: { type: Boolean, required: true },
        projects: { type: Boolean, required: true },
        summary: { type: Boolean, required: true },
      },
      required: true,
    },
  },
  { timestamps: true },
);

const Analysis =
  mongoose.models.Analysis ||
  mongoose.model<IAnalysis>("Analysis", analysisSchema);

export default Analysis;

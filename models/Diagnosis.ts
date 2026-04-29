import { model, models, Schema, Types, type Model } from "mongoose";

const DiagnosisSchema = new Schema(
  {
    userId: {
      type: Schema.Types.ObjectId,
      required: true,
      ref: "User",
      index: true,
    },
    answers: {
      q1: { type: String, required: true, trim: true },
      q2: { type: String, required: true, trim: true },
      q3: { type: String, required: true, trim: true },
      q4: { type: String, required: true, trim: true },
      q5: { type: String, required: true, trim: true },
    },
    result: {
      summary: { type: String, required: true, trim: true },
      strengths: [{ type: String, required: true, trim: true }],
      recommendedCareers: [{ type: String, required: true, trim: true }],
      cautions: [{ type: String, required: true, trim: true }],
    },
    careerRoadmap: {
      shortTerm: [{ type: String, required: true, trim: true }],
      midTerm: [{ type: String, required: true, trim: true }],
      longTerm: [{ type: String, required: true, trim: true }],
    },
  },
  { timestamps: true },
);

DiagnosisSchema.index({ userId: 1, createdAt: -1 });

export type DiagnosisDocument = {
  _id: Types.ObjectId;
  userId: Types.ObjectId;
  answers: {
    q1: string;
    q2: string;
    q3: string;
    q4: string;
    q5: string;
  };
  result: {
    summary: string;
    strengths: string[];
    recommendedCareers: string[];
    cautions: string[];
  };
  careerRoadmap: {
    shortTerm: string[];
    midTerm: string[];
    longTerm: string[];
  };
  createdAt: Date;
  updatedAt: Date;
};

export const DiagnosisModel =
  (models.Diagnosis as Model<DiagnosisDocument> | undefined) ??
  model<DiagnosisDocument>("Diagnosis", DiagnosisSchema);

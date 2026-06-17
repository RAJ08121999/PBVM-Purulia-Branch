import mongoose, { Schema, Document } from "mongoose";

export interface IMembership extends Document {
  fullName: string;
  dateOfBirth: Date;
  gender: string;
  occupation: string;
  educationalQualification: string;
  address: string;
  district: string;
  state: string;
  phoneNumber: string;
  email: string;
  areasOfInterest: string[];
  motivation: string;
  status: "pending" | "approved" | "rejected";
  submittedAt: Date;
}

const MembershipSchema = new Schema<IMembership>(
  {
    fullName: { type: String, required: true, trim: true },
    dateOfBirth: { type: Date, required: true },
    gender: { type: String, required: true },
    occupation: { type: String, required: true, trim: true },
    educationalQualification: { type: String, required: true, trim: true },
    address: { type: String, required: true, trim: true },
    district: { type: String, required: true, trim: true },
    state: { type: String, required: true, trim: true },
    phoneNumber: { type: String, required: true, trim: true },
    email: { type: String, required: true, lowercase: true, trim: true },
    areasOfInterest: [{ type: String }],
    motivation: { type: String, required: true },
    status: { type: String, enum: ["pending", "approved", "rejected"], default: "pending" },
    submittedAt: { type: Date, default: Date.now },
  },
  { timestamps: true }
);

MembershipSchema.index({ status: 1, submittedAt: -1 });

export default mongoose.model<IMembership>("Membership", MembershipSchema);

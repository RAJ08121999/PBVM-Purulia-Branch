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
  
  // New Fields
  membershipType: "member" | "volunteer";
  bloodGroup?: string;
  volunteerId?: string;
  approvedAt?: Date;
  approvedBy?: mongoose.Types.ObjectId;
  badgeLevel?: "Curiosity Seeker" | "Knowledge Explorer" | "Renaissance Leader";
  photo?: string;
  availability?: "Weekdays" | "Weekends" | "Any Time" | "Occasionally";
  timeContribution?: "2-4 hrs/week" | "5-10 hrs/week" | "10+ hrs/week";
  skills?: string[];
  previousExperienceNGO?: "Yes" | "No";
  previousExperienceDetails?: string;
  canTravel?: "Within my block" | "Anywhere in Purulia" | "Anywhere in West Bengal" | "No";
  emergencyContact?: {
    name: string;
    relation: string;
    phone: string;
  };
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
    
    // New Fields
    membershipType: { type: String, enum: ["member", "volunteer"], default: "member", required: true },
    bloodGroup: { type: String },
    volunteerId: { type: String },
    approvedAt: { type: Date },
    approvedBy: { type: Schema.Types.ObjectId, ref: "Admin" },
    badgeLevel: { type: String, enum: ["Curiosity Seeker", "Knowledge Explorer", "Renaissance Leader"], default: "Curiosity Seeker" },
    photo: { type: String },
    availability: { type: String, enum: ["Weekdays", "Weekends", "Any Time", "Occasionally"] },
    timeContribution: { type: String, enum: ["2-4 hrs/week", "5-10 hrs/week", "10+ hrs/week"] },
    skills: [{ type: String }],
    previousExperienceNGO: { type: String, enum: ["Yes", "No"] },
    previousExperienceDetails: { type: String },
    canTravel: { type: String, enum: ["Within my block", "Anywhere in Purulia", "Anywhere in West Bengal", "No"] },
    emergencyContact: {
      name: { type: String },
      relation: { type: String },
      phone: { type: String },
    },
  },
  { timestamps: true }
);

MembershipSchema.index({ status: 1, submittedAt: -1 });

export default mongoose.model<IMembership>("Membership", MembershipSchema);

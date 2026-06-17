import mongoose, { Schema, Document } from "mongoose";

interface BilingualString { en: string; bn: string; }
interface ImpactStat { label: BilingualString; value: string; }

export interface IActivity extends Document {
  slug: string;
  title: BilingualString;
  bannerImage: string;
  introduction: BilingualString;
  objectives: BilingualString[];
  gallery: string[];
  reports: BilingualString[];
  videoEmbedUrl?: string;
  impactStats: ImpactStat[];
  createdAt: Date;
  updatedAt: Date;
}

const BilingualStringSchema = new Schema<BilingualString>({ en: String, bn: String }, { _id: false });
const ImpactStatSchema = new Schema<ImpactStat>({ label: BilingualStringSchema, value: String }, { _id: false });

const ActivitySchema = new Schema<IActivity>(
  {
    slug: { type: String, required: true, unique: true, lowercase: true, trim: true },
    title: { type: BilingualStringSchema, required: true },
    bannerImage: { type: String, required: true },
    introduction: { type: BilingualStringSchema, required: true },
    objectives: [BilingualStringSchema],
    gallery: [{ type: String }],
    reports: [BilingualStringSchema],
    videoEmbedUrl: { type: String },
    impactStats: [ImpactStatSchema],
  },
  { timestamps: true }
);

export default mongoose.model<IActivity>("Activity", ActivitySchema);

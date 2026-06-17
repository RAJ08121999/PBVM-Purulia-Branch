import mongoose, { Schema, Document } from "mongoose";

interface BilingualString { en: string; bn: string; }

export interface IPolicyArticle extends Document {
  title: BilingualString;
  topicTags: string[];
  body: BilingualString;
  coverImage?: string;
  status: "draft" | "published";
  publishDate?: Date;
  createdAt: Date;
  updatedAt: Date;
}

const TOPIC_TAGS = ["Environment","Public Health","Education","Science Policy","Technology Policy","Climate Change","Anti-superstition Awareness"];
const BilingualStringSchema = new Schema<BilingualString>({ en: String, bn: String }, { _id: false });

const PolicyArticleSchema = new Schema<IPolicyArticle>(
  {
    title: { type: BilingualStringSchema, required: true },
    topicTags: [{ type: String, enum: TOPIC_TAGS }],
    body: { type: BilingualStringSchema, required: true },
    coverImage: { type: String },
    status: { type: String, enum: ["draft", "published"], default: "draft" },
    publishDate: { type: Date },
  },
  { timestamps: true }
);

PolicyArticleSchema.index({ status: 1, publishDate: -1 });

export default mongoose.model<IPolicyArticle>("PolicyArticle", PolicyArticleSchema);

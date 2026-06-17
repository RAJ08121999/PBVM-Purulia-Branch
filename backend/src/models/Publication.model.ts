import mongoose, { Schema, Document } from "mongoose";

interface BilingualString { en: string; bn: string; }

export interface IPublication extends Document {
  title: BilingualString;
  category: "Magazine" | "Newsletter" | "Report" | "Booklet" | "Awareness Material";
  description?: BilingualString;
  thumbnailImage?: string;
  pdfFile: string;
  publishDate: Date;
  createdAt: Date;
  updatedAt: Date;
}

const BilingualStringSchema = new Schema<BilingualString>({ en: String, bn: String }, { _id: false });

const PublicationSchema = new Schema<IPublication>(
  {
    title: { type: BilingualStringSchema, required: true },
    category: {
      type: String,
      enum: ["Magazine", "Newsletter", "Report", "Booklet", "Awareness Material"],
      required: true,
    },
    description: { type: BilingualStringSchema },
    thumbnailImage: { type: String },
    pdfFile: { type: String, required: true },
    publishDate: { type: Date, required: true },
  },
  { timestamps: true }
);

PublicationSchema.index({ category: 1, publishDate: -1 });

export default mongoose.model<IPublication>("Publication", PublicationSchema);

import mongoose, { Schema, Document } from "mongoose";

interface BilingualString { en: string; bn: string; }

export interface IDownload extends Document {
  title: BilingualString;
  category: "Membership Forms" | "Event Brochures" | "Awareness Materials" | "Posters" | "Reports" | "Publications";
  file: string;
  downloadCount: number;
  createdAt: Date;
  updatedAt: Date;
}

const BilingualStringSchema = new Schema<BilingualString>({ en: String, bn: String }, { _id: false });

const DownloadSchema = new Schema<IDownload>(
  {
    title: { type: BilingualStringSchema, required: true },
    category: {
      type: String,
      enum: ["Membership Forms","Event Brochures","Awareness Materials","Posters","Reports","Publications"],
      required: true,
    },
    file: { type: String, required: true },
    downloadCount: { type: Number, default: 0 },
  },
  { timestamps: true }
);

export default mongoose.model<IDownload>("Download", DownloadSchema);

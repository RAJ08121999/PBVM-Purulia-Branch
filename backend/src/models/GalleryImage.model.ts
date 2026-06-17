import mongoose, { Schema, Document } from "mongoose";

interface BilingualString { en: string; bn: string; }

export interface IGalleryImage extends Document {
  fileUrl: string;
  category: "Science Camps" | "Exhibitions" | "Awareness Campaigns" | "Skywatching" | "Environmental Activities" | "Workshops";
  caption?: BilingualString;
  relatedActivity?: mongoose.Types.ObjectId;
  relatedEvent?: mongoose.Types.ObjectId;
  uploadedAt: Date;
}

const BilingualStringSchema = new Schema<BilingualString>({ en: String, bn: String }, { _id: false });

const GalleryImageSchema = new Schema<IGalleryImage>(
  {
    fileUrl: { type: String, required: true },
    category: {
      type: String,
      enum: ["Science Camps","Exhibitions","Awareness Campaigns","Skywatching","Environmental Activities","Workshops"],
      required: true,
    },
    caption: { type: BilingualStringSchema },
    relatedActivity: { type: Schema.Types.ObjectId, ref: "Activity" },
    relatedEvent: { type: Schema.Types.ObjectId, ref: "Event" },
    uploadedAt: { type: Date, default: Date.now },
  },
  { timestamps: true }
);

GalleryImageSchema.index({ category: 1, uploadedAt: -1 });

export default mongoose.model<IGalleryImage>("GalleryImage", GalleryImageSchema);

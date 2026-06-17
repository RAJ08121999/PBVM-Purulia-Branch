import mongoose, { Schema, Document } from "mongoose";

export interface INotification extends Document {
  title: string;
  body?: string;
  isPinned: boolean;
  isArchived: boolean;
  createdBy: mongoose.Types.ObjectId;
  createdAt: Date;
  updatedAt: Date;
}

const NotificationSchema = new Schema<INotification>(
  {
    title: { type: String, required: true, trim: true },
    body: { type: String },
    isPinned: { type: Boolean, default: false },
    isArchived: { type: Boolean, default: false },
    createdBy: { type: Schema.Types.ObjectId, ref: "Admin", required: true },
  },
  { timestamps: true }
);

NotificationSchema.index({ isPinned: -1, createdAt: -1 });

export default mongoose.model<INotification>("Notification", NotificationSchema);

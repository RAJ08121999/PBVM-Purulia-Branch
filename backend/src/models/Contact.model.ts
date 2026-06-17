import mongoose, { Schema, Document } from "mongoose";

export interface IContact extends Document {
  name: string;
  email: string;
  phone?: string;
  message: string;
  submittedAt: Date;
  status: "new" | "reviewed";
}

const ContactSchema = new Schema<IContact>(
  {
    name: { type: String, required: true, trim: true },
    email: { type: String, required: true, lowercase: true, trim: true },
    phone: { type: String, trim: true },
    message: { type: String, required: true },
    submittedAt: { type: Date, default: Date.now },
    status: { type: String, enum: ["new", "reviewed"], default: "new" },
  },
  { timestamps: true }
);

ContactSchema.index({ status: 1, submittedAt: -1 });

export default mongoose.model<IContact>("Contact", ContactSchema);

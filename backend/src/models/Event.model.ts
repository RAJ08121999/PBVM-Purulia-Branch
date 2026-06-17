import mongoose, { Schema, Document, CallbackError } from "mongoose";

interface BilingualString { en: string; bn: string; }

export interface IEvent extends Document {
  title: BilingualString;
  date: Date;
  venue: string;
  description: BilingualString;
  registrationLink?: string;
  gallery: string[];
  status: "upcoming" | "past";
  createdAt: Date;
  updatedAt: Date;
}

const BilingualStringSchema = new Schema<BilingualString>({ en: String, bn: String }, { _id: false });

const EventSchema = new Schema<IEvent>(
  {
    title: { type: BilingualStringSchema, required: true },
    date: { type: Date, required: true },
    venue: { type: String, required: true, trim: true },
    description: { type: BilingualStringSchema, required: true },
    registrationLink: { type: String },
    gallery: [{ type: String }],
    status: { type: String, enum: ["upcoming", "past"], default: "upcoming" },
  },
  { timestamps: true }
);

EventSchema.index({ date: 1, status: 1 });

// Auto-update status based on date
EventSchema.pre("save", function () {
  this.status = this.date >= new Date() ? "upcoming" : "past";
});

export default mongoose.model<IEvent>("Event", EventSchema);

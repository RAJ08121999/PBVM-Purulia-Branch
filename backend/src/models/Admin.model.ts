import mongoose, { Schema, Document, CallbackError } from "mongoose";
import bcrypt from "bcryptjs";

export interface IAdmin extends Document {
  name: string;
  email: string;
  passwordHash: string;
  role: "Administrator" | "SuperAdministrator";
  lastLoginAt?: Date;
  createdAt: Date;
  comparePassword(password: string): Promise<boolean>;
}

const AdminSchema = new Schema<IAdmin>(
  {
    name: { type: String, required: true, trim: true },
    email: { type: String, required: true, unique: true, lowercase: true, trim: true },
    passwordHash: { type: String, required: true },
    role: { type: String, enum: ["Administrator", "SuperAdministrator"], default: "Administrator" },
    lastLoginAt: { type: Date },
  },
  { timestamps: true }
);

AdminSchema.methods.comparePassword = async function (password: string): Promise<boolean> {
  return bcrypt.compare(password, this.passwordHash);
};

// Hash password before saving
AdminSchema.pre("save", async function () {
  if (!this.isModified("passwordHash")) return;
  this.passwordHash = await bcrypt.hash(this.passwordHash as string, 12);
});

export default mongoose.model<IAdmin>("Admin", AdminSchema);

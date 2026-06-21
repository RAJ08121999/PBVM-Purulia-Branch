import mongoose from "mongoose";
import dotenv from "dotenv";
import path from "path";
import Admin from "../models/Admin.model";

// Load environment variables from backend directory
dotenv.config({ path: path.join(__dirname, "../../.env") });

const seedSuperAdmin = async () => {
  const uri = process.env.MONGODB_URI;
  if (!uri) {
    console.error("❌ MONGODB_URI is not defined in environment variables");
    process.exit(1);
  }

  try {
    await mongoose.connect(uri);
    console.log("✅ Connected to MongoDB for seeding...");

    // Check if any admin exists
    const adminCount = await Admin.countDocuments();
    if (adminCount > 0) {
      console.log("ℹ️ Database already has admin accounts. Skipping seed.");
      await mongoose.disconnect();
      process.exit(0);
    }

    // Create default Super Admin
    const email = process.env.DEFAULT_ADMIN_EMAIL || "admin@pbvmpurulia.org";
    const password = process.env.DEFAULT_ADMIN_PASSWORD || "PbvmAdmin2026!";
    const name = process.env.DEFAULT_ADMIN_NAME || "Super Admin";

    const defaultSuperAdmin = new Admin({
      name,
      email,
      passwordHash: password, // Pre-save hook in Admin model will hash this
      role: "SuperAdministrator",
    });

    await defaultSuperAdmin.save();
    console.log("=========================================");
    console.log("✅ DEFAULT SUPER ADMINISTRATOR CREATED:");
    console.log(`👤 Name:     ${name}`);
    console.log(`✉️ Email:    ${email}`);
    console.log(`🔑 Password: ${password}`);
    console.log("=========================================");

    await mongoose.disconnect();
    console.log("✅ Database disconnected. Seeding completed successfully.");
    process.exit(0);
  } catch (error) {
    console.error("❌ Seeding failed:", error);
    process.exit(1);
  }
};

seedSuperAdmin();

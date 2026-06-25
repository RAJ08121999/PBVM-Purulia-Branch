import mongoose from "mongoose";
import dotenv from "dotenv";
import path from "path";
import Admin from "../models/Admin.model";

dotenv.config({ path: path.join(__dirname, "../../.env") });

const seedSuperAdmin = async () => {
  const uri = process.env.MONGODB_URI;
  if (!uri) {
    console.error("MONGODB_URI is not defined in environment variables");
    process.exit(1);
  }

  try {
    await mongoose.connect(uri);
    console.log("Connected to MongoDB for seeding...");

    const email = process.env.DEFAULT_ADMIN_EMAIL || "admin@pbvmpurulia.org";
    const password = process.env.DEFAULT_ADMIN_PASSWORD || "PbvmAdmin2026!";
    const name = process.env.DEFAULT_ADMIN_NAME || "Super Admin";
    const shouldResetPassword = process.env.DEFAULT_ADMIN_RESET_PASSWORD === "true";

    const existingDefaultAdmin = await Admin.findOne({ email });

    if (existingDefaultAdmin) {
      existingDefaultAdmin.name = name;
      existingDefaultAdmin.role = "SuperAdministrator";

      if (shouldResetPassword) {
        existingDefaultAdmin.passwordHash = password;
      }

      await existingDefaultAdmin.save();

      console.log("=========================================");
      console.log("Default super administrator verified:");
      console.log(`Name:     ${name}`);
      console.log(`Email:    ${email}`);
      console.log(
        shouldResetPassword
          ? "Password reset from DEFAULT_ADMIN_PASSWORD."
          : "Existing password kept. Set DEFAULT_ADMIN_RESET_PASSWORD=true to reset it."
      );
      console.log("=========================================");

      await mongoose.disconnect();
      console.log("Database disconnected. Seeding completed successfully.");
      process.exit(0);
    }

    const defaultSuperAdmin = new Admin({
      name,
      email,
      passwordHash: password,
      role: "SuperAdministrator",
    });

    await defaultSuperAdmin.save();
    console.log("=========================================");
    console.log("Default super administrator created:");
    console.log(`Name:     ${name}`);
    console.log(`Email:    ${email}`);
    console.log(`Password: ${password}`);
    console.log("=========================================");

    await mongoose.disconnect();
    console.log("Database disconnected. Seeding completed successfully.");
    process.exit(0);
  } catch (error) {
    console.error("Seeding failed:", error);
    process.exit(1);
  }
};

seedSuperAdmin();

import multer from "multer";
import { Request, Response, NextFunction } from "express";
import { v2 as cloudinary } from "cloudinary";
import path from "path";
import fs from "fs";

// Ensure local uploads directory exists
const uploadsDir = path.join(__dirname, "../../public/uploads");
if (!fs.existsSync(uploadsDir)) {
  fs.mkdirSync(uploadsDir, { recursive: true });
}

// Multer in-memory storage configuration
const storage = multer.memoryStorage();

// File filter to check file types
const fileFilter = (req: Request, file: Express.Multer.File, cb: multer.FileFilterCallback) => {
  const allowedExtensions = [".jpg", ".jpeg", ".png", ".webp", ".pdf", ".doc", ".docx"];
  const ext = path.extname(file.originalname).toLowerCase();
  
  if (allowedExtensions.includes(ext)) {
    cb(null, true);
  } else {
    cb(new Error(`Invalid file type. Allowed: ${allowedExtensions.join(", ")}`));
  }
};

export const upload = multer({
  storage,
  fileFilter,
  limits: { fileSize: 10 * 1024 * 1024 }, // 10MB limit
});

// Helper function to upload buffer to Cloudinary
const uploadToCloudinary = (fileBuffer: Buffer, folder: string, filename: string): Promise<string> => {
  return new Promise((resolve, reject) => {
    const isPdf = filename.toLowerCase().endsWith(".pdf");
    const stream = cloudinary.uploader.upload_stream(
      {
        folder: `pbvm_purulia/${folder}`,
        public_id: `${Date.now()}-${path.parse(filename).name}`,
        resource_type: isPdf ? "raw" : "auto",
        format: isPdf ? "pdf" : undefined,
      },
      (error, result) => {
        if (error) return reject(error);
        resolve(result?.secure_url || "");
      }
    );
    stream.write(fileBuffer);
    stream.end();
  });
};

// Helper function to save buffer locally
const saveLocally = async (fileBuffer: Buffer, filename: string): Promise<string> => {
  const ext = path.extname(filename);
  const uniqueName = `${Date.now()}-${Math.round(Math.random() * 1e9)}${ext}`;
  const filePath = path.join(uploadsDir, uniqueName);
  await fs.promises.writeFile(filePath, fileBuffer);
  return `/uploads/${uniqueName}`;
};

/**
 * Handles uploading a single file. 
 * Resolves to the public URL (Cloudinary or local static path).
 */
export const handleSingleUpload = async (
  file: Express.Multer.File | undefined,
  folder: string,
  req: Request
): Promise<string> => {
  if (!file) return "";

  const isCloudinaryConfigured =
    process.env.CLOUDINARY_CLOUD_NAME &&
    process.env.CLOUDINARY_API_KEY &&
    process.env.CLOUDINARY_API_SECRET;

  if (isCloudinaryConfigured) {
    try {
      return await uploadToCloudinary(file.buffer, folder, file.originalname);
    } catch (error) {
      console.warn("⚠️ Cloudinary upload failed, falling back to local storage:", error);
    }
  }

  // Fallback to local storage
  const localPath = await saveLocally(file.buffer, file.originalname);
  const baseUrl = `${req.protocol}://${req.get("host")}`;
  return `${baseUrl}${localPath}`;
};

/**
 * Handles uploading multiple files.
 * Resolves to an array of public URLs.
 */
export const handleMultipleUploads = async (
  files: Express.Multer.File[] | undefined,
  folder: string,
  req: Request
): Promise<string[]> => {
  if (!files || files.length === 0) return [];

  const uploadPromises = files.map((file) => handleSingleUpload(file, folder, req));
  return Promise.all(uploadPromises);
};

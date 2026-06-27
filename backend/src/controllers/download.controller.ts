import { Request, Response } from "express";
import Download from "../models/Download.model";
import { AuthRequest } from "../middleware/auth.middleware";
import { handleSingleUpload } from "../middleware/upload.middleware";

const safeParse = (val: any) => {
  if (typeof val === "string") {
    try {
      return JSON.parse(val);
    } catch {
      return val;
    }
  }
  return val;
};

// @desc    Get downloadable resources
// @route   GET /api/downloads
// @access  Public
export const getDownloads = async (req: Request, res: Response): Promise<void> => {
  try {
    const { category } = req.query;
    const filter: any = {};

    if (category) {
      filter.category = category;
    }

    const downloads = await Download.find(filter).sort({ createdAt: -1 });
    res.json({ success: true, downloads });
  } catch (error: any) {
    res.status(500).json({ success: false, message: error.message });
  }
};

// @desc    Create new downloadable resource
// @route   POST /api/downloads
// @access  Private (Admin)
export const createDownload = async (req: AuthRequest, res: Response): Promise<void> => {
  try {
    const { category } = req.body;
    const title = safeParse(req.body.title);

    if (!title || !category) {
      res.status(400).json({ success: false, message: "Required fields are missing" });
      return;
    }

    if (!req.file) {
      res.status(400).json({ success: false, message: "Resource file is required" });
      return;
    }

    const fileUrl = await handleSingleUpload(req.file, "downloads", req);

    const download = new Download({
      title,
      category,
      file: fileUrl,
    
      originalName: req.file.originalname,
      fileSize: req.file.size,
      mimeType: req.file.mimetype,
    });

    await download.save();
    res.status(201).json({ success: true, download });
  } catch (error: any) {
    res.status(500).json({ success: false, message: error.message });
  }
};

// @desc    Track file download (increment count)
// @route   POST /api/downloads/:id/track
// @access  Public
export const trackDownload = async (req: Request, res: Response): Promise<void> => {
  try {
    const download = await Download.findByIdAndUpdate(
      req.params.id,
      { $inc: { downloadCount: 1 } },
      { new: true }
    );

    if (!download) {
      res.status(404).json({ success: false, message: "Resource not found" });
      return;
    }

    res.json({ success: true, downloadCount: download.downloadCount });
  } catch (error: any) {
    res.status(500).json({ success: false, message: error.message });
  }
};

// @desc    Delete downloadable resource
// @route   DELETE /api/downloads/:id
// @access  Private (Admin)
export const deleteDownload = async (req: AuthRequest, res: Response): Promise<void> => {
  try {
    const download = await Download.findByIdAndDelete(req.params.id);
    if (!download) {
      res.status(404).json({ success: false, message: "Resource not found" });
      return;
    }
    res.json({ success: true, message: "Resource deleted successfully" });
  } catch (error: any) {
    res.status(500).json({ success: false, message: error.message });
  }
};

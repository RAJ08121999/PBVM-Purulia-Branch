import { Request, Response } from "express";
import GalleryImage from "../models/GalleryImage.model";
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

// @desc    Get gallery images
// @route   GET /api/gallery
// @access  Public
export const getGallery = async (req: Request, res: Response): Promise<void> => {
  try {
    const { category, page = 1, limit = 20 } = req.query;
    const filter: any = {};

    if (category) {
      filter.category = category;
    }

    const skipIndex = (Number(page) - 1) * Number(limit);
    const total = await GalleryImage.countDocuments(filter);
    const images = await GalleryImage.find(filter)
      .sort({ uploadedAt: -1 })
      .skip(skipIndex)
      .limit(Number(limit));

    res.json({
      success: true,
      total,
      page: Number(page),
      limit: Number(limit),
      images,
    });
  } catch (error: any) {
    res.status(500).json({ success: false, message: error.message });
  }
};

// @desc    Bulk upload gallery images
// @route   POST /api/gallery
// @access  Private (Admin)
export const uploadGalleryImages = async (req: AuthRequest, res: Response): Promise<void> => {
  try {
    const { category } = req.body;
    const caption = safeParse(req.body.caption);
    const relatedActivity = req.body.relatedActivity || undefined;
    const relatedEvent = req.body.relatedEvent || undefined;

    if (!category) {
      res.status(400).json({ success: false, message: "Category is required" });
      return;
    }

    const files = req.files as Express.Multer.File[] | undefined;
    if (!files || files.length === 0) {
      res.status(400).json({ success: false, message: "No files uploaded" });
      return;
    }

    const savedImages = [];
    for (const file of files) {
      const fileUrl = await handleSingleUpload(file, "gallery", req);
      const galleryImage = new GalleryImage({
        fileUrl,
        category,
        caption,
        relatedActivity,
        relatedEvent,
      });
      await galleryImage.save();
      savedImages.push(galleryImage);
    }

    res.status(201).json({
      success: true,
      message: `${savedImages.length} images uploaded successfully`,
      images: savedImages,
    });
  } catch (error: any) {
    res.status(500).json({ success: false, message: error.message });
  }
};

// @desc    Delete gallery image
// @route   DELETE /api/gallery/:id
// @access  Private (Admin)
export const deleteGalleryImage = async (req: AuthRequest, res: Response): Promise<void> => {
  try {
    const image = await GalleryImage.findByIdAndDelete(req.params.id);
    if (!image) {
      res.status(404).json({ success: false, message: "Image not found" });
      return;
    }
    res.json({ success: true, message: "Image deleted successfully" });
  } catch (error: any) {
    res.status(500).json({ success: false, message: error.message });
  }
};

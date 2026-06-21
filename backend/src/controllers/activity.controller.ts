import { Request, Response } from "express";
import Activity from "../models/Activity.model";
import { AuthRequest } from "../middleware/auth.middleware";
import { handleSingleUpload, handleMultipleUploads } from "../middleware/upload.middleware";

// Helper to safely parse JSON strings from form-data
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

// @desc    Get all activities
// @route   GET /api/activities
// @access  Public
export const getActivities = async (req: Request, res: Response): Promise<void> => {
  try {
    const activities = await Activity.find().sort({ createdAt: 1 });
    res.json({ success: true, activities });
  } catch (error: any) {
    res.status(500).json({ success: false, message: error.message });
  }
};

// @desc    Get activity by slug
// @route   GET /api/activities/:slug
// @access  Public
export const getActivityBySlug = async (req: Request, res: Response): Promise<void> => {
  try {
    const activity = await Activity.findOne({ slug: String(req.params.slug).toLowerCase() });
    if (!activity) {
      res.status(404).json({ success: false, message: "Activity not found" });
      return;
    }
    res.json({ success: true, activity });
  } catch (error: any) {
    res.status(500).json({ success: false, message: error.message });
  }
};

// @desc    Update activity content
// @route   PUT /api/activities/:id
// @access  Private (Admin)
export const updateActivity = async (req: AuthRequest, res: Response): Promise<void> => {
  try {
    const { id } = req.params;
    const activity = await Activity.findById(id);
    if (!activity) {
      res.status(404).json({ success: false, message: "Activity not found" });
      return;
    }

    const files = req.files as { [fieldname: string]: Express.Multer.File[] } | undefined;

    // Handle Banner Image upload
    let bannerImageUrl = activity.bannerImage;
    if (files && files["bannerImage"] && files["bannerImage"][0]) {
      bannerImageUrl = await handleSingleUpload(files["bannerImage"][0], "activities", req);
    }

    // Handle Gallery uploads
    let newGalleryUrls: string[] = [];
    if (files && files["gallery"]) {
      newGalleryUrls = await handleMultipleUploads(files["gallery"], "activities", req);
    }

    // Parse text fields (they arrive as JSON strings in multipart form-data)
    const title = safeParse(req.body.title);
    const introduction = safeParse(req.body.introduction);
    const objectives = safeParse(req.body.objectives);
    const reports = safeParse(req.body.reports);
    const impactStats = safeParse(req.body.impactStats);
    const videoEmbedUrl = req.body.videoEmbedUrl;
    const existingGallery = safeParse(req.body.existingGallery); // Optional list of currently kept gallery URLs

    if (title) activity.title = title;
    if (introduction) activity.introduction = introduction;
    if (objectives) activity.objectives = objectives;
    if (reports) activity.reports = reports;
    if (impactStats) activity.impactStats = impactStats;
    if (videoEmbedUrl !== undefined) activity.videoEmbedUrl = videoEmbedUrl;
    activity.bannerImage = bannerImageUrl;

    // Merge gallery: keep selected existing images and append new ones
    if (existingGallery && Array.isArray(existingGallery)) {
      activity.gallery = [...existingGallery, ...newGalleryUrls];
    } else {
      activity.gallery = [...activity.gallery, ...newGalleryUrls];
    }

    await activity.save();
    res.json({ success: true, activity });
  } catch (error: any) {
    res.status(500).json({ success: false, message: error.message });
  }
};

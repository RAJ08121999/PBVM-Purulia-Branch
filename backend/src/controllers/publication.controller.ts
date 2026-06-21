import { Request, Response } from "express";
import Publication from "../models/Publication.model";
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

// @desc    Get publications
// @route   GET /api/publications
// @access  Public
export const getPublications = async (req: Request, res: Response): Promise<void> => {
  try {
    const { category, search, page = 1, limit = 10 } = req.query;
    const filter: any = {};

    if (category) {
      filter.category = category;
    }

    if (search) {
      const searchRegex = { $regex: search, $options: "i" };
      filter.$or = [
        { "title.en": searchRegex },
        { "title.bn": searchRegex },
        { "description.en": searchRegex },
        { "description.bn": searchRegex },
      ];
    }

    const skipIndex = (Number(page) - 1) * Number(limit);
    const total = await Publication.countDocuments(filter);
    const publications = await Publication.find(filter)
      .sort({ publishDate: -1 })
      .skip(skipIndex)
      .limit(Number(limit));

    res.json({
      success: true,
      total,
      page: Number(page),
      limit: Number(limit),
      publications,
    });
  } catch (error: any) {
    res.status(500).json({ success: false, message: error.message });
  }
};

// @desc    Create new publication
// @route   POST /api/publications
// @access  Private (Admin)
export const createPublication = async (req: AuthRequest, res: Response): Promise<void> => {
  try {
    const { category, publishDate } = req.body;
    const title = safeParse(req.body.title);
    const description = safeParse(req.body.description);

    if (!title || !category || !publishDate) {
      res.status(400).json({ success: false, message: "Required fields are missing" });
      return;
    }

    const files = req.files as { [fieldname: string]: Express.Multer.File[] } | undefined;
    
    // PDF File is required
    if (!files || !files["pdfFile"] || !files["pdfFile"][0]) {
      res.status(400).json({ success: false, message: "PDF document file is required" });
      return;
    }

    const pdfFileUrl = await handleSingleUpload(files["pdfFile"][0], "publications/pdf", req);
    
    let thumbnailUrl = "";
    if (files["thumbnailImage"] && files["thumbnailImage"][0]) {
      thumbnailUrl = await handleSingleUpload(files["thumbnailImage"][0], "publications/thumbnails", req);
    }

    const publication = new Publication({
      title,
      category,
      description,
      pdfFile: pdfFileUrl,
      thumbnailImage: thumbnailUrl || undefined,
      publishDate: new Date(publishDate),
    });

    await publication.save();
    res.status(201).json({ success: true, publication });
  } catch (error: any) {
    res.status(500).json({ success: false, message: error.message });
  }
};

// @desc    Update publication
// @route   PUT /api/publications/:id
// @access  Private (Admin)
export const updatePublication = async (req: AuthRequest, res: Response): Promise<void> => {
  try {
    const publication = await Publication.findById(req.params.id);
    if (!publication) {
      res.status(404).json({ success: false, message: "Publication not found" });
      return;
    }

    const { category, publishDate } = req.body;
    const title = safeParse(req.body.title);
    const description = safeParse(req.body.description);

    const files = req.files as { [fieldname: string]: Express.Multer.File[] } | undefined;

    let pdfFileUrl = publication.pdfFile;
    if (files && files["pdfFile"] && files["pdfFile"][0]) {
      pdfFileUrl = await handleSingleUpload(files["pdfFile"][0], "publications/pdf", req);
    }

    let thumbnailUrl = publication.thumbnailImage;
    if (files && files["thumbnailImage"] && files["thumbnailImage"][0]) {
      thumbnailUrl = await handleSingleUpload(files["thumbnailImage"][0], "publications/thumbnails", req);
    }

    if (title) publication.title = title;
    if (category) publication.category = category;
    if (description) publication.description = description;
    if (publishDate) publication.publishDate = new Date(publishDate);
    publication.pdfFile = pdfFileUrl;
    if (thumbnailUrl) publication.thumbnailImage = thumbnailUrl;

    await publication.save();
    res.json({ success: true, publication });
  } catch (error: any) {
    res.status(500).json({ success: false, message: error.message });
  }
};

// @desc    Delete publication
// @route   DELETE /api/publications/:id
// @access  Private (Admin)
export const deletePublication = async (req: AuthRequest, res: Response): Promise<void> => {
  try {
    const publication = await Publication.findByIdAndDelete(req.params.id);
    if (!publication) {
      res.status(404).json({ success: false, message: "Publication not found" });
      return;
    }
    res.json({ success: true, message: "Publication deleted successfully" });
  } catch (error: any) {
    res.status(500).json({ success: false, message: error.message });
  }
};

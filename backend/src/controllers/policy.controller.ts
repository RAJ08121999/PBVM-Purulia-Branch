import { Request, Response } from "express";
import PolicyArticle from "../models/PolicyArticle.model";
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

// @desc    Get policy articles
// @route   GET /api/policy
// @access  Public (Only published for public, draft/published for admins)
export const getPolicyArticles = async (req: Request, res: Response): Promise<void> => {
  try {
    const { tag, status, page = 1, limit = 10 } = req.query;
    const filter: any = {};

    // Public gets only published, unless admin requests drafts
    if (status) {
      filter.status = status;
    } else {
      filter.status = "published";
    }

    if (tag) {
      filter.topicTags = tag;
    }

    const skipIndex = (Number(page) - 1) * Number(limit);
    const total = await PolicyArticle.countDocuments(filter);
    const articles = await PolicyArticle.find(filter)
      .sort({ publishDate: -1, createdAt: -1 })
      .skip(skipIndex)
      .limit(Number(limit));

    res.json({
      success: true,
      total,
      page: Number(page),
      limit: Number(limit),
      articles,
    });
  } catch (error: any) {
    res.status(500).json({ success: false, message: error.message });
  }
};

// @desc    Get single policy article by ID
// @route   GET /api/policy/:id
// @access  Public
export const getPolicyArticle = async (req: Request, res: Response): Promise<void> => {
  try {
    const article = await PolicyArticle.findById(req.params.id);
    if (!article) {
      res.status(404).json({ success: false, message: "Article not found" });
      return;
    }
    res.json({ success: true, article });
  } catch (error: any) {
    res.status(500).json({ success: false, message: error.message });
  }
};

// @desc    Create policy article
// @route   POST /api/policy
// @access  Private (Admin)
export const createPolicyArticle = async (req: AuthRequest, res: Response): Promise<void> => {
  try {
    const { status, topicTags } = req.body;
    const title = safeParse(req.body.title);
    const bodyText = safeParse(req.body.body);

    if (!title || !bodyText) {
      res.status(400).json({ success: false, message: "Title and Body are required" });
      return;
    }

    let coverImageUrl = "";
    if (req.file) {
      coverImageUrl = await handleSingleUpload(req.file, "policy", req);
    }

    const article = new PolicyArticle({
      title,
      body: bodyText,
      topicTags: safeParse(topicTags) || [],
      status: status || "draft",
      coverImage: coverImageUrl || undefined,
      publishDate: status === "published" ? new Date() : undefined,
    });

    await article.save();
    res.status(201).json({ success: true, article });
  } catch (error: any) {
    res.status(500).json({ success: false, message: error.message });
  }
};

// @desc    Update policy article
// @route   PUT /api/policy/:id
// @access  Private (Admin)
export const updatePolicyArticle = async (req: AuthRequest, res: Response): Promise<void> => {
  try {
    const article = await PolicyArticle.findById(req.params.id);
    if (!article) {
      res.status(404).json({ success: false, message: "Article not found" });
      return;
    }

    const { status, topicTags } = req.body;
    const title = safeParse(req.body.title);
    const bodyText = safeParse(req.body.body);

    let coverImageUrl = article.coverImage;
    if (req.file) {
      coverImageUrl = await handleSingleUpload(req.file, "policy", req);
    }

    if (title) article.title = title;
    if (bodyText) article.body = bodyText;
    if (topicTags) article.topicTags = safeParse(topicTags);
    if (coverImageUrl) article.coverImage = coverImageUrl;

    if (status && status !== article.status) {
      article.status = status;
      if (status === "published" && !article.publishDate) {
        article.publishDate = new Date();
      }
    }

    await article.save();
    res.json({ success: true, article });
  } catch (error: any) {
    res.status(500).json({ success: false, message: error.message });
  }
};

// @desc    Delete policy article
// @route   DELETE /api/policy/:id
// @access  Private (Admin)
export const deletePolicyArticle = async (req: AuthRequest, res: Response): Promise<void> => {
  try {
    const article = await PolicyArticle.findByIdAndDelete(req.params.id);
    if (!article) {
      res.status(404).json({ success: false, message: "Article not found" });
      return;
    }
    res.json({ success: true, message: "Article deleted successfully" });
  } catch (error: any) {
    res.status(500).json({ success: false, message: error.message });
  }
};

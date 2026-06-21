import { Request, Response } from "express";
import Notification from "../models/Notification.model";
import { AuthRequest } from "../middleware/auth.middleware";

// @desc    Get all notifications
// @route   GET /api/notifications
// @access  Public
export const getNotifications = async (req: Request, res: Response): Promise<void> => {
  try {
    const notifications = await Notification.find({ isArchived: false })
      .populate("createdBy", "name email")
      .sort({ isPinned: -1, createdAt: -1 });
    res.json({ success: true, notifications });
  } catch (error: any) {
    res.status(500).json({ success: false, message: error.message });
  }
};

// @desc    Create new notification
// @route   POST /api/notifications
// @access  Private (Admin)
export const createNotification = async (req: AuthRequest, res: Response): Promise<void> => {
  try {
    const { title, body, isPinned, isArchived } = req.body;
    if (!title) {
      res.status(400).json({ success: false, message: "Title is required" });
      return;
    }

    if (!req.admin) {
      res.status(401).json({ success: false, message: "Unauthorized" });
      return;
    }

    const notification = new Notification({
      title,
      body,
      isPinned: isPinned || false,
      isArchived: isArchived || false,
      createdBy: req.admin.id,
    });

    await notification.save();
    res.status(201).json({ success: true, notification });
  } catch (error: any) {
    res.status(500).json({ success: false, message: error.message });
  }
};

// @desc    Update notification
// @route   PUT /api/notifications/:id
// @access  Private (Admin)
export const updateNotification = async (req: AuthRequest, res: Response): Promise<void> => {
  try {
    const { title, body, isPinned, isArchived } = req.body;
    const notification = await Notification.findById(req.params.id);

    if (!notification) {
      res.status(404).json({ success: false, message: "Notification not found" });
      return;
    }

    if (title !== undefined) notification.title = title;
    if (body !== undefined) notification.body = body;
    if (isPinned !== undefined) notification.isPinned = isPinned;
    if (isArchived !== undefined) notification.isArchived = isArchived;

    await notification.save();
    res.json({ success: true, notification });
  } catch (error: any) {
    res.status(500).json({ success: false, message: error.message });
  }
};

// @desc    Delete notification
// @route   DELETE /api/notifications/:id
// @access  Private (Admin)
export const deleteNotification = async (req: AuthRequest, res: Response): Promise<void> => {
  try {
    const notification = await Notification.findByIdAndDelete(req.params.id);
    if (!notification) {
      res.status(404).json({ success: false, message: "Notification not found" });
      return;
    }
    res.json({ success: true, message: "Notification deleted successfully" });
  } catch (error: any) {
    res.status(500).json({ success: false, message: error.message });
  }
};

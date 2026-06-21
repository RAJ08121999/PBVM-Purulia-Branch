import { Request, Response } from "express";
import Event from "../models/Event.model";
import { AuthRequest } from "../middleware/auth.middleware";
import { handleMultipleUploads } from "../middleware/upload.middleware";

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

// @desc    Get all events
// @route   GET /api/events
// @access  Public
export const getEvents = async (req: Request, res: Response): Promise<void> => {
  try {
    const { status, page = 1, limit = 10 } = req.query;
    const filter: any = {};
    
    if (status === "upcoming" || status === "past") {
      filter.status = status;
    }

    const skipIndex = (Number(page) - 1) * Number(limit);

    // Dynamic update statuses based on current date before returning
    // Although the pre-save hook exists, some past events could still be "upcoming" if date passed
    const eventsToUpdate = await Event.find({ status: "upcoming", date: { $lt: new Date() } });
    if (eventsToUpdate.length > 0) {
      for (const e of eventsToUpdate) {
        e.status = "past";
        await e.save();
      }
    }

    const total = await Event.countDocuments(filter);
    const events = await Event.find(filter)
      .sort({ date: status === "upcoming" ? 1 : -1 }) // Sort upcoming chronologically ascending, past descending
      .skip(skipIndex)
      .limit(Number(limit));

    res.json({
      success: true,
      total,
      page: Number(page),
      limit: Number(limit),
      events,
    });
  } catch (error: any) {
    res.status(500).json({ success: false, message: error.message });
  }
};

// @desc    Get single event by ID
// @route   GET /api/events/:id
// @access  Public
export const getEvent = async (req: Request, res: Response): Promise<void> => {
  try {
    const event = await Event.findById(req.params.id);
    if (!event) {
      res.status(404).json({ success: false, message: "Event not found" });
      return;
    }
    res.json({ success: true, event });
  } catch (error: any) {
    res.status(500).json({ success: false, message: error.message });
  }
};

// @desc    Create new event
// @route   POST /api/events
// @access  Private (Admin)
export const createEvent = async (req: AuthRequest, res: Response): Promise<void> => {
  try {
    const { venue, date, registrationLink } = req.body;
    const title = safeParse(req.body.title);
    const description = safeParse(req.body.description);

    if (!title || !date || !venue || !description) {
      res.status(400).json({ success: false, message: "Required fields are missing" });
      return;
    }

    // Upload photos from 'gallery' field
    const files = req.files as Express.Multer.File[] | undefined;
    const galleryUrls = await handleMultipleUploads(files, "events", req);

    const event = new Event({
      title,
      date: new Date(date),
      venue,
      description,
      registrationLink,
      gallery: galleryUrls,
    });

    await event.save();
    res.status(201).json({ success: true, event });
  } catch (error: any) {
    res.status(500).json({ success: false, message: error.message });
  }
};

// @desc    Update event
// @route   PUT /api/events/:id
// @access  Private (Admin)
export const updateEvent = async (req: AuthRequest, res: Response): Promise<void> => {
  try {
    const event = await Event.findById(req.params.id);
    if (!event) {
      res.status(404).json({ success: false, message: "Event not found" });
      return;
    }

    const { venue, date, registrationLink } = req.body;
    const title = safeParse(req.body.title);
    const description = safeParse(req.body.description);
    const existingGallery = safeParse(req.body.existingGallery);

    // Upload new photos from 'gallery' field
    const files = req.files as Express.Multer.File[] | undefined;
    const newGalleryUrls = await handleMultipleUploads(files, "events", req);

    if (title) event.title = title;
    if (description) event.description = description;
    if (venue) event.venue = venue;
    if (date) event.date = new Date(date);
    if (registrationLink !== undefined) event.registrationLink = registrationLink;

    if (existingGallery && Array.isArray(existingGallery)) {
      event.gallery = [...existingGallery, ...newGalleryUrls];
    } else {
      event.gallery = [...event.gallery, ...newGalleryUrls];
    }

    await event.save();
    res.json({ success: true, event });
  } catch (error: any) {
    res.status(500).json({ success: false, message: error.message });
  }
};

// @desc    Delete event
// @route   DELETE /api/events/:id
// @access  Private (Admin)
export const deleteEvent = async (req: AuthRequest, res: Response): Promise<void> => {
  try {
    const event = await Event.findByIdAndDelete(req.params.id);
    if (!event) {
      res.status(404).json({ success: false, message: "Event not found" });
      return;
    }
    res.json({ success: true, message: "Event deleted successfully" });
  } catch (error: any) {
    res.status(500).json({ success: false, message: error.message });
  }
};

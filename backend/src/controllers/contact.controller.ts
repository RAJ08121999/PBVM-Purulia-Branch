import { Request, Response } from "express";
import Contact from "../models/Contact.model";
import { AuthRequest } from "../middleware/auth.middleware";
import { sendAdminNotification } from "../config/email";

// Helper to build CSV text
const jsonToCsv = (headers: string[], rows: any[][]): string => {
  const escapeCell = (val: any) => {
    if (val === null || val === undefined) return '""';
    const str = String(val).replace(/"/g, '""');
    return `"${str}"`;
  };

  const headerLine = headers.join(",");
  const rowLines = rows.map((row) => row.map(escapeCell).join(",")).join("\n");
  return `${headerLine}\n${rowLines}`;
};

// @desc    Submit contact inquiry
// @route   POST /api/contact
// @access  Public
export const submitContact = async (req: Request, res: Response): Promise<void> => {
  try {
    const { name, email, phone, message } = req.body;
    if (!name || !email || !message) {
      res.status(400).json({ success: false, message: "Required fields are missing" });
      return;
    }

    const contact = new Contact({
      name,
      email,
      phone,
      message,
    });

    await contact.save();

    // Trigger Admin Notification Email asynchronously
    const subject = `New Contact Inquiry from ${name}`;
    const html = `
      <h3>New Contact Inquiry Received</h3>
      <p><strong>Name:</strong> ${name}</p>
      <p><strong>Email:</strong> ${email}</p>
      <p><strong>Phone:</strong> ${phone || "N/A"}</p>
      <p><strong>Message:</strong></p>
      <p style="white-space: pre-line; background: #f5f7fa; padding: 10px; border-radius: 5px;">${message}</p>
      <hr />
      <p>This inquiry has been stored in the PBVM Purulia website database. You can review it on the Admin Dashboard.</p>
    `;
    
    // Fire and forget (don't block the client response on SMTP wait)
    sendAdminNotification(subject, html).catch((err) => {
      console.error("[CONTACT EMAIL ERROR]", err);
    });

    res.status(201).json({ success: true, message: "Inquiry submitted successfully", contact });
  } catch (error: any) {
    res.status(500).json({ success: false, message: error.message });
  }
};

// @desc    Get contact inquiries
// @route   GET /api/contact/admin
// @access  Private (Admin)
export const getContactInquiries = async (req: AuthRequest, res: Response): Promise<void> => {
  try {
    const { status, page = 1, limit = 20 } = req.query;
    const filter: any = {};

    if (status === "new" || status === "reviewed") {
      filter.status = status;
    }

    const skipIndex = (Number(page) - 1) * Number(limit);
    const total = await Contact.countDocuments(filter);
    const inquiries = await Contact.find(filter)
      .sort({ submittedAt: -1 })
      .skip(skipIndex)
      .limit(Number(limit));

    res.json({
      success: true,
      total,
      page: Number(page),
      limit: Number(limit),
      inquiries,
    });
  } catch (error: any) {
    res.status(500).json({ success: false, message: error.message });
  }
};

// @desc    Update contact status (Reviewed)
// @route   PUT /api/contact/:id/status
// @access  Private (Admin)
export const updateContactStatus = async (req: AuthRequest, res: Response): Promise<void> => {
  try {
    const { status } = req.body;
    if (status !== "new" && status !== "reviewed") {
      res.status(400).json({ success: false, message: "Invalid status" });
      return;
    }

    const contact = await Contact.findByIdAndUpdate(
      req.params.id,
      { status },
      { new: true }
    );

    if (!contact) {
      res.status(404).json({ success: false, message: "Inquiry not found" });
      return;
    }

    res.json({ success: true, contact });
  } catch (error: any) {
    res.status(500).json({ success: false, message: error.message });
  }
};

// @desc    Export contact inquiries to CSV
// @route   GET /api/contact/export
// @access  Private (Admin)
export const exportContactInquiries = async (req: AuthRequest, res: Response): Promise<void> => {
  try {
    const inquiries = await Contact.find().sort({ submittedAt: -1 });

    const headers = ["Name", "Email", "Phone", "Message", "Status", "Submitted At"];
    const rows = inquiries.map((i) => [
      i.name,
      i.email,
      i.phone || "",
      i.message,
      i.status,
      i.submittedAt.toISOString(),
    ]);

    const csvContent = jsonToCsv(headers, rows);

    res.setHeader("Content-Type", "text/csv; charset=utf-8");
    res.setHeader("Content-Disposition", "attachment; filename=contact_inquiries.csv");
    res.status(200).send(csvContent);
  } catch (error: any) {
    res.status(500).json({ success: false, message: error.message });
  }
};

// @desc    Delete contact inquiry
// @route   DELETE /api/contact/admin/:id
// @access  Private (Admin)
export const deleteContactInquiry = async (req: AuthRequest, res: Response): Promise<void> => {
  try {
    const contact = await Contact.findByIdAndDelete(req.params.id);
    if (!contact) {
      res.status(404).json({ success: false, message: "Inquiry not found" });
      return;
    }
    res.json({ success: true, message: "Inquiry deleted successfully" });
  } catch (error: any) {
    res.status(500).json({ success: false, message: error.message });
  }
};

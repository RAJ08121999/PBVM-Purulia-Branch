import { Request, Response } from "express";
import Membership from "../models/Membership.model";
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

// @desc    Submit membership application
// @route   POST /api/membership
// @access  Public
export const submitMembership = async (req: Request, res: Response): Promise<void> => {
  try {
    const {
      fullName,
      dateOfBirth,
      gender,
      occupation,
      educationalQualification,
      address,
      district,
      state,
      phoneNumber,
      email,
      areasOfInterest,
      motivation,
    } = req.body;

    if (
      !fullName ||
      !dateOfBirth ||
      !gender ||
      !occupation ||
      !educationalQualification ||
      !address ||
      !district ||
      !state ||
      !phoneNumber ||
      !email ||
      !motivation
    ) {
      res.status(400).json({ success: false, message: "Required fields are missing" });
      return;
    }

    const parsedDOB = new Date(dateOfBirth);
    if (isNaN(parsedDOB.getTime()) || parsedDOB > new Date()) {
      res.status(400).json({ success: false, message: "Please provide a valid Date of Birth" });
      return;
    }

    const membership = new Membership({
      fullName,
      dateOfBirth: parsedDOB,
      gender,
      occupation,
      educationalQualification,
      address,
      district,
      state,
      phoneNumber,
      email,
      areasOfInterest: areasOfInterest || [],
      motivation,
    });

    await membership.save();

    // Trigger Admin Notification Email asynchronously
    const subject = `New Membership Application from ${fullName}`;
    const html = `
      <h3>New Membership Application Received</h3>
      <p><strong>Full Name:</strong> ${fullName}</p>
      <p><strong>Email:</strong> ${email}</p>
      <p><strong>Phone:</strong> ${phoneNumber}</p>
      <p><strong>Occupation:</strong> ${occupation}</p>
      <p><strong>District:</strong> ${district}</p>
      <p><strong>Motivation:</strong></p>
      <p style="white-space: pre-line; background: #f5f7fa; padding: 10px; border-radius: 5px;">${motivation}</p>
      <hr />
      <p>Please review this application in detail on the Admin Dashboard to Approve or Reject it.</p>
    `;

    sendAdminNotification(subject, html).catch((err) => {
      console.error("[MEMBERSHIP EMAIL ERROR]", err);
    });

    res.status(201).json({ success: true, message: "Application submitted successfully", membership });
  } catch (error: any) {
    res.status(500).json({ success: false, message: error.message });
  }
};

// @desc    Get membership applications
// @route   GET /api/membership/admin
// @access  Private (Admin)
export const getMemberships = async (req: AuthRequest, res: Response): Promise<void> => {
  try {
    const { status, page = 1, limit = 20 } = req.query;
    const filter: any = {};

    if (status === "pending" || status === "approved" || status === "rejected") {
      filter.status = status;
    }

    const skipIndex = (Number(page) - 1) * Number(limit);
    const total = await Membership.countDocuments(filter);
    const memberships = await Membership.find(filter)
      .sort({ submittedAt: -1 })
      .skip(skipIndex)
      .limit(Number(limit));

    res.json({
      success: true,
      total,
      page: Number(page),
      limit: Number(limit),
      memberships,
    });
  } catch (error: any) {
    res.status(500).json({ success: false, message: error.message });
  }
};

// @desc    Update membership application status
// @route   PUT /api/membership/:id/status
// @access  Private (Admin)
export const updateMembershipStatus = async (req: AuthRequest, res: Response): Promise<void> => {
  try {
    const { status } = req.body;
    if (status !== "pending" && status !== "approved" && status !== "rejected") {
      res.status(400).json({ success: false, message: "Invalid status" });
      return;
    }

    const membership = await Membership.findByIdAndUpdate(
      req.params.id,
      { status },
      { new: true }
    );

    if (!membership) {
      res.status(404).json({ success: false, message: "Membership application not found" });
      return;
    }

    res.json({ success: true, membership });
  } catch (error: any) {
    res.status(500).json({ success: false, message: error.message });
  }
};

// @desc    Export membership applications to CSV
// @route   GET /api/membership/export
// @access  Private (Admin)
export const exportMemberships = async (req: AuthRequest, res: Response): Promise<void> => {
  try {
    const memberships = await Membership.find().sort({ submittedAt: -1 });

    const headers = [
      "Full Name",
      "Email",
      "Phone",
      "DOB",
      "Gender",
      "Occupation",
      "Qualification",
      "Address",
      "District",
      "State",
      "Areas of Interest",
      "Motivation",
      "Status",
      "Submitted At",
    ];

    const rows = memberships.map((m) => [
      m.fullName,
      m.email,
      m.phoneNumber,
      m.dateOfBirth.toISOString().split("T")[0],
      m.gender,
      m.occupation,
      m.educationalQualification,
      m.address,
      m.district,
      m.state,
      m.areasOfInterest.join(" | "),
      m.motivation,
      m.status,
      m.submittedAt.toISOString(),
    ]);

    const csvContent = jsonToCsv(headers, rows);

    res.setHeader("Content-Type", "text/csv; charset=utf-8");
    res.setHeader("Content-Disposition", "attachment; filename=memberships.csv");
    res.status(200).send(csvContent);
  } catch (error: any) {
    res.status(500).json({ success: false, message: error.message });
  }
};

// @desc    Delete membership application
// @route   DELETE /api/membership/admin/:id
// @access  Private (Admin)
export const deleteMembership = async (req: AuthRequest, res: Response): Promise<void> => {
  try {
    const membership = await Membership.findByIdAndDelete(req.params.id);
    if (!membership) {
      res.status(404).json({ success: false, message: "Membership application not found" });
      return;
    }
    res.json({ success: true, message: "Membership application deleted successfully" });
  } catch (error: any) {
    res.status(500).json({ success: false, message: error.message });
  }
};

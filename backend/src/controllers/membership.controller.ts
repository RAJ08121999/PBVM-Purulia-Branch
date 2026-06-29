import { Request, Response } from "express";
import Membership from "../models/Membership.model";
import { AuthRequest } from "../middleware/auth.middleware";
import { sendAdminNotification } from "../config/email";
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
      membershipType = "member",
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
      motivation,
      availability,
      timeContribution,
      previousExperienceNGO,
      previousExperienceDetails,
      canTravel,
    } = req.body;

    const areasOfInterest = safeParse(req.body.areasOfInterest);
    const skills = safeParse(req.body.skills);
    const emergencyContact = safeParse(req.body.emergencyContact);

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

    // Conditional Validation for Volunteer
    if (membershipType === "volunteer") {
      if (!availability || !timeContribution || !canTravel) {
        res.status(400).json({ success: false, message: "Volunteer availability, time contribution, and travel preferences are required" });
        return;
      }
      if (!emergencyContact || !emergencyContact.name || !emergencyContact.phone) {
        res.status(400).json({ success: false, message: "Emergency contact name and phone are required for volunteers" });
        return;
      }
    }

    const parsedDOB = new Date(dateOfBirth);
    if (isNaN(parsedDOB.getTime()) || parsedDOB > new Date()) {
      res.status(400).json({ success: false, message: "Please provide a valid Date of Birth" });
      return;
    }

    let photoUrl = "";
    if (req.file) {
      photoUrl = await handleSingleUpload(req.file, "membership", req);
    }

    const membership = new Membership({
      membershipType,
      fullName,
      dateOfBirth: parsedDOB,
      gender,
      photo: photoUrl || undefined,
      occupation,
      educationalQualification,
      address,
      district,
      state,
      phoneNumber,
      email,
      areasOfInterest: areasOfInterest || [],
      motivation,
      // Volunteer specific fields
      availability: membershipType === "volunteer" ? availability : undefined,
      timeContribution: membershipType === "volunteer" ? timeContribution : undefined,
      skills: membershipType === "volunteer" ? (skills || []) : undefined,
      previousExperienceNGO: membershipType === "volunteer" ? previousExperienceNGO : undefined,
      previousExperienceDetails: membershipType === "volunteer" ? previousExperienceDetails : undefined,
      canTravel: membershipType === "volunteer" ? canTravel : undefined,
      emergencyContact: membershipType === "volunteer" ? emergencyContact : undefined,
    });

    await membership.save();

    // Trigger Admin Notification Email asynchronously
    const typeLabel = membershipType === "volunteer" ? "Volunteer" : "General Member";
    const subject = `New ${typeLabel} Application from ${fullName}`;
    
    let volunteerDetailsHtml = "";
    if (membershipType === "volunteer") {
      volunteerDetailsHtml = `
        <hr />
        <h4>Volunteer Specific Details</h4>
        <p><strong>Availability:</strong> ${availability}</p>
        <p><strong>Time Contribution:</strong> ${timeContribution}</p>
        <p><strong>Skills:</strong> ${(skills || []).join(", ")}</p>
        <p><strong>Previous Experience with NGO:</strong> ${previousExperienceNGO === "Yes" ? `Yes - ${previousExperienceDetails}` : "No"}</p>
        <p><strong>Can Travel:</strong> ${canTravel}</p>
        <p><strong>Emergency Contact:</strong> ${emergencyContact?.name} (${emergencyContact?.relation}) - ${emergencyContact?.phone}</p>
      `;
    }

    const html = `
      <h3>New ${typeLabel} Application Received</h3>
      <p><strong>Full Name:</strong> ${fullName}</p>
      <p><strong>Email:</strong> ${email}</p>
      <p><strong>Phone:</strong> ${phoneNumber}</p>
      <p><strong>Occupation:</strong> ${occupation}</p>
      <p><strong>District:</strong> ${district}</p>
      <p><strong>Motivation:</strong></p>
      <p style="white-space: pre-line; background: #f5f7fa; padding: 10px; border-radius: 5px;">${motivation}</p>
      ${volunteerDetailsHtml}
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
      "Membership Type",
      "Full Name",
      "Email",
      "Phone",
      "DOB",
      "Gender",
      "Photo URL",
      "Occupation",
      "Qualification",
      "Address",
      "District",
      "State",
      "Areas of Interest",
      "Motivation",
      "Availability",
      "Time Contribution",
      "Skills",
      "Previous Experience NGO",
      "Previous Experience Details",
      "Can Travel",
      "Emergency Contact Name",
      "Emergency Contact Relation",
      "Emergency Contact Phone",
      "Status",
      "Submitted At",
    ];

    const rows = memberships.map((m) => [
      m.membershipType || "member",
      m.fullName,
      m.email,
      m.phoneNumber,
      m.dateOfBirth ? m.dateOfBirth.toISOString().split("T")[0] : "",
      m.gender,
      m.photo || "",
      m.occupation,
      m.educationalQualification,
      m.address,
      m.district,
      m.state,
      (m.areasOfInterest || []).join(" | "),
      m.motivation,
      m.availability || "",
      m.timeContribution || "",
      (m.skills || []).join(" | "),
      m.previousExperienceNGO || "",
      m.previousExperienceDetails || "",
      m.canTravel || "",
      m.emergencyContact?.name || "",
      m.emergencyContact?.relation || "",
      m.emergencyContact?.phone || "",
      m.status,
      m.submittedAt ? m.submittedAt.toISOString() : "",
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

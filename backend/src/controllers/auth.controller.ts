import { Request, Response } from "express";
import jwt from "jsonwebtoken";
import Admin from "../models/Admin.model";
import { AuthRequest } from "../middleware/auth.middleware";

// Generate JWT Helper
const generateToken = (id: string, role: string, email: string): string => {
  return jwt.sign(
    { id, role, email },
    process.env.JWT_SECRET || "fallback_super_secret_key_12345",
    { expiresIn: process.env.JWT_EXPIRES_IN || "7d" } as jwt.SignOptions
  );
};

// @desc    Admin login
// @route   POST /api/auth/login
// @access  Public
export const login = async (req: Request, res: Response): Promise<void> => {
  try {
    const { email, password } = req.body;
    if (!email || !password) {
      res.status(400).json({ success: false, message: "Please provide email and password" });
      return;
    }

    const admin = await Admin.findOne({ email });
    if (!admin) {
      res.status(401).json({ success: false, message: "Invalid credentials" });
      return;
    }

    const isMatch = await admin.comparePassword(password);
    if (!isMatch) {
      res.status(401).json({ success: false, message: "Invalid credentials" });
      return;
    }

    // Update last login
    admin.lastLoginAt = new Date();
    await admin.save();

    const token = generateToken(admin.id, admin.role, admin.email);

    res.json({
      success: true,
      token,
      admin: {
        id: admin.id,
        name: admin.name,
        email: admin.email,
        role: admin.role,
      },
    });
  } catch (error: any) {
    res.status(500).json({ success: false, message: error.message });
  }
};

// @desc    Get current admin profile
// @route   GET /api/auth/me
// @access  Private (Admin)
export const getMe = async (req: AuthRequest, res: Response): Promise<void> => {
  try {
    if (!req.admin) {
      res.status(401).json({ success: false, message: "Not authenticated" });
      return;
    }

    const admin = await Admin.findById(req.admin.id).select("-passwordHash");
    if (!admin) {
      res.status(404).json({ success: false, message: "Admin not found" });
      return;
    }

    res.json({ success: true, admin });
  } catch (error: any) {
    res.status(500).json({ success: false, message: error.message });
  }
};

// @desc    Update own profile
// @route   PUT /api/auth/update-profile
// @access  Private (Admin)
export const updateProfile = async (req: AuthRequest, res: Response): Promise<void> => {
  try {
    if (!req.admin) {
      res.status(401).json({ success: false, message: "Not authenticated" });
      return;
    }

    const { name, email, password } = req.body;
    const admin = await Admin.findById(req.admin.id);
    
    if (!admin) {
      res.status(404).json({ success: false, message: "Admin not found" });
      return;
    }

    if (name) admin.name = name;
    if (email) {
      // Check if email is already taken by another admin
      const emailExists = await Admin.findOne({ email, _id: { $ne: admin._id } });
      if (emailExists) {
        res.status(400).json({ success: false, message: "Email is already taken" });
        return;
      }
      admin.email = email;
    }
    
    if (password) {
      admin.passwordHash = password; // Pre-save hook will hash it automatically
    }

    await admin.save();

    res.json({
      success: true,
      message: "Profile updated successfully",
      admin: {
        id: admin.id,
        name: admin.name,
        email: admin.email,
        role: admin.role,
      },
    });
  } catch (error: any) {
    res.status(500).json({ success: false, message: error.message });
  }
};

// @desc    Get all admins (Super Admin only)
// @route   GET /api/auth/admins
// @access  Private (Super Admin)
export const getAdmins = async (req: AuthRequest, res: Response): Promise<void> => {
  try {
    const admins = await Admin.find().select("-passwordHash").sort({ createdAt: -1 });
    res.json({ success: true, admins });
  } catch (error: any) {
    res.status(500).json({ success: false, message: error.message });
  }
};

// @desc    Create new admin account (Super Admin only)
// @route   POST /api/auth/admins
// @access  Private (Super Admin)
export const createAdmin = async (req: AuthRequest, res: Response): Promise<void> => {
  try {
    const { name, email, password, role } = req.body;
    if (!name || !email || !password) {
      res.status(400).json({ success: false, message: "Please provide all required fields" });
      return;
    }

    const emailExists = await Admin.findOne({ email });
    if (emailExists) {
      res.status(400).json({ success: false, message: "Admin with this email already exists" });
      return;
    }

    const newAdmin = new Admin({
      name,
      email,
      passwordHash: password, // Pre-save hook will hash it
      role: role || "Administrator",
    });

    await newAdmin.save();

    res.status(201).json({
      success: true,
      message: "Admin created successfully",
      admin: {
        id: newAdmin.id,
        name: newAdmin.name,
        email: newAdmin.email,
        role: newAdmin.role,
      },
    });
  } catch (error: any) {
    res.status(500).json({ success: false, message: error.message });
  }
};

// @desc    Delete admin account (Super Admin only)
// @route   DELETE /api/auth/admins/:id
// @access  Private (Super Admin)
export const deleteAdmin = async (req: AuthRequest, res: Response): Promise<void> => {
  try {
    const adminId = req.params.id;

    // Prevent self-deletion
    if (req.admin && req.admin.id === adminId) {
      res.status(400).json({ success: false, message: "You cannot delete your own account" });
      return;
    }

    const admin = await Admin.findByIdAndDelete(adminId);
    if (!admin) {
      res.status(404).json({ success: false, message: "Admin not found" });
      return;
    }

    res.json({ success: true, message: "Admin deleted successfully" });
  } catch (error: any) {
    res.status(500).json({ success: false, message: error.message });
  }
};

const express = require("express");
const bcrypt = require("bcrypt");
const { createClient } = require("@supabase/supabase-js");
const verifyAdmin = require("../middleware/verifyAdmin");

const router = express.Router();
// Use SERVICE_KEY for backend operations to bypass RLS
const supabase = createClient(process.env.SUPABASE_URL, process.env.SUPABASE_SERVICE_KEY);
const SALT_ROUNDS = 10;

// Get all users (Admin only)
router.get("/", verifyAdmin, async (req, res) => {
  try {
    const { page = 1, limit = 10, search = '', role = '' } = req.query;
    const offset = (page - 1) * limit;

    let query = supabase
      .from('users')
      .select('id, name, email, role, created_at', { count: 'exact' });

    // Add search filter
    if (search) {
      query = query.or(`name.ilike.%${search}%,email.ilike.%${search}%`);
    }

    // Add role filter
    if (role) {
      query = query.eq('role', role);
    }

    // Add pagination
    query = query.range(offset, offset + limit - 1).order('created_at', { ascending: false });

    const { data: users, error, count } = await query;

    if (error) {
      console.error("Error fetching users:", error);
      return res.status(500).json({ error: "Failed to fetch users" });
    }

    res.json({
      users,
      pagination: {
        page: parseInt(page),
        limit: parseInt(limit),
        total: count,
        pages: Math.ceil(count / limit)
      }
    });
  } catch (error) {
    console.error("Error in get users:", error);
    res.status(500).json({ error: "Internal server error" });
  }
});

// Create new user (Admin only)
router.post("/", verifyAdmin, async (req, res) => {
  try {
    const { name, email, password, role } = req.body;

    if (!name || !email || !password || !role) {
      return res.status(400).json({ error: "All fields are required" });
    }

    if (!['USER', 'ADMIN'].includes(role)) {
      return res.status(400).json({ error: "Invalid role. Must be USER or ADMIN" });
    }

    // Check if email already exists
    const { data: existing } = await supabase
      .from('users')
      .select('id')
      .eq('email', email)
      .limit(1);

    if (existing && existing.length > 0) {
      return res.status(409).json({ error: 'Email already exists' });
    }

    // Hash password
    const hashedPassword = await bcrypt.hash(password, SALT_ROUNDS);

    // Create user
    const { data: newUser, error } = await supabase
      .from("users")
      .insert([{ name, email, password: hashedPassword, role }])
      .select('id, name, email, role, created_at')
      .single();

    if (error) {
      console.error("Error creating user:", error);
      return res.status(500).json({ error: "Failed to create user" });
    }

    res.status(201).json({ user: newUser, message: "User created successfully" });
  } catch (error) {
    console.error("Error in create user:", error);
    res.status(500).json({ error: "Internal server error" });
  }
});

// Update user (Admin only)
router.put("/:id", verifyAdmin, async (req, res) => {
  try {
    const { id } = req.params;
    const { name, email, role, password } = req.body;

    if (!name || !email || !role) {
      return res.status(400).json({ error: "Name, email, and role are required" });
    }

    if (!['USER', 'ADMIN'].includes(role)) {
      return res.status(400).json({ error: "Invalid role. Must be USER or ADMIN" });
    }

    // Check if email already exists for other users
    const { data: existing } = await supabase
      .from('users')
      .select('id')
      .eq('email', email)
      .neq('id', id)
      .limit(1);

    if (existing && existing.length > 0) {
      return res.status(409).json({ error: 'Email already exists' });
    }

    // Prepare update data
    const updateData = { name, email, role };

    // Hash new password if provided
    if (password && password.trim() !== '') {
      updateData.password = await bcrypt.hash(password, SALT_ROUNDS);
    }

    // Update user
    const { data: updatedUser, error } = await supabase
      .from("users")
      .update(updateData)
      .eq('id', id)
      .select('id, name, email, role, created_at')
      .single();

    if (error) {
      console.error("Error updating user:", error);
      return res.status(500).json({ error: "Failed to update user" });
    }

    if (!updatedUser) {
      return res.status(404).json({ error: "User not found" });
    }

    res.json({ user: updatedUser, message: "User updated successfully" });
  } catch (error) {
    console.error("Error in update user:", error);
    res.status(500).json({ error: "Internal server error" });
  }
});

// Delete user (Admin only)
router.delete("/:id", verifyAdmin, async (req, res) => {
  try {
    const { id } = req.params;

    // Don't allow admin to delete themselves
    if (id === req.user.id) {
      return res.status(400).json({ error: "Cannot delete your own account" });
    }

    // Delete user
    const { data: deletedUser, error } = await supabase
      .from("users")
      .delete()
      .eq('id', id)
      .select('id, name, email, role')
      .single();

    if (error) {
      console.error("Error deleting user:", error);
      return res.status(500).json({ error: "Failed to delete user" });
    }

    if (!deletedUser) {
      return res.status(404).json({ error: "User not found" });
    }

    res.json({ message: "User deleted successfully", user: deletedUser });
  } catch (error) {
    console.error("Error in delete user:", error);
    res.status(500).json({ error: "Internal server error" });
  }
});

// Get single user (Admin only)
router.get("/:id", verifyAdmin, async (req, res) => {
  try {
    const { id } = req.params;

    const { data: user, error } = await supabase
      .from('users')
      .select('id, name, email, role, created_at')
      .eq('id', id)
      .single();

    if (error) {
      console.error("Error fetching user:", error);
      return res.status(500).json({ error: "Failed to fetch user" });
    }

    if (!user) {
      return res.status(404).json({ error: "User not found" });
    }

    res.json({ user });
  } catch (error) {
    console.error("Error in get user:", error);
    res.status(500).json({ error: "Internal server error" });
  }
});

module.exports = router;
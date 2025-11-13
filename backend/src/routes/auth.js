const express = require("express");
const bcrypt = require("bcrypt");
const jwt = require("jsonwebtoken");
const { createClient } = require("@supabase/supabase-js");

const router = express.Router();
// Use SERVICE_KEY for backend operations to bypass RLS
const supabase = createClient(process.env.SUPABASE_URL, process.env.SUPABASE_SERVICE_KEY);
const JWT_SECRET = process.env.JWT_SECRET;
const SALT_ROUNDS = 10; // Number of salt rounds for bcrypt

// Signup route
router.post("/", async (req, res) => {
    try {
        const { name, email, password, role } = req.body; // role can be 'admin' or 'user'
        if (!name || !email || !password || !role) return res.status(400).json({ error: "All fields are required" });

        // Check existing user
        const { data: existing } = await supabase.from('users').select('id').eq('email', email).limit(1);
        if (existing && existing.length) return res.status(409).json({ error: 'email exists' });

        const hashed = await bcrypt.hash(password, SALT_ROUNDS);
        const { data, error } = await supabase.from("users").insert([{ name, email, password: hashed, role }]).select().single();
        if(error) return res.status(500).json({ error: "Error creating user" });

        const token = jwt.sign({ id: data.id, role: data.role, name: data.name }, JWT_SECRET, { expiresIn: '7d' });
        res.json({ token, user: { id: data.id, name: data.name, email: data.email, role: data.role }});
    } catch (error) {
        console.error("Error in signup:", error);
        res.status(500).json({ error: "Internal server error" });
    }
});


// Login route

router.post('/login', async (req, res) => {
  try {
    const { email, password } = req.body;
    const { data } = await supabase.from('users').select('*').eq('email', email).limit(1).single();
    if (!data) return res.status(401).json({ error: 'invalid credentials' });
    const valid = await bcrypt.compare(password, data.password);
    if (!valid) return res.status(401).json({ error: 'invalid credentials' });

    const token = jwt.sign({ id: data.id, role: data.role, name: data.name }, JWT_SECRET, { expiresIn: '7d' });
    res.json({ token, user: { id: data.id, name: data.name, email: data.email, role: data.role } });
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: 'server error' });
  }
});

// Me route

router.get('/me', async (req, res) => {
  const auth = req.headers.authorization;
  if (!auth) return res.status(401).json({ error: 'no token' });
  const token = auth.split(' ')[1];
  try {
    const payload = jwt.verify(token, JWT_SECRET);
    const { data } = await supabase.from('users').select('id,name,email,role').eq('id', payload.id).single();
    res.json({ user: data });
  } catch (err) {
    return res.status(401).json({ error: 'invalid token' });
  }
});

// Logout route
router.post('/logout', async (req, res) => {
  try {
    // For JWT-based auth, logout is typically handled on the frontend
    // by removing the token from storage
    res.json({ message: 'Logged out successfully' });
  } catch (error) {
    console.error("Error in logout:", error);
    res.status(500).json({ error: "Internal server error" });
  }
});

module.exports = router;
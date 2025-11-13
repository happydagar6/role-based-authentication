require("dotenv").config();
const express = require("express");
const cors = require("cors");

const authRouter = require("./routes/auth");

const app = express(); // Create an Express application
app.use(cors()); // Enable CORS for all routes
app.use(express.json()); // Middleware to parse JSON request bodies


app.get("/health", (req, res) => res.json({ ok: true }));
app.use("/api/auth", authRouter); // Use the auth router for authentication routes

const PORT = process.env.PORT || 4000;
app.listen(PORT, () => console.log(`Server listening on ${PORT}`));
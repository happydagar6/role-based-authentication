const jwt = require("jsonwebtoken");

const verifyAdmin = (req, res, next) => {
  try {
    const authHeader = req.headers.authorization;
    
    if (!authHeader) {
      return res.status(401).json({ error: "Access denied. No token provided." });
    }

    const token = authHeader.split(' ')[1];
    
    if (!token) {
      return res.status(401).json({ error: "Access denied. Invalid token format." });
    }

    const decoded = jwt.verify(token, process.env.JWT_SECRET);
    
    // Check if user has admin role
    if (decoded.role !== 'ADMIN') {
      return res.status(403).json({ error: "Access denied. Admin role required." });
    }
    
    req.user = decoded;
    next();
  } catch (error) {
    console.error("Admin verification error:", error);
    return res.status(401).json({ error: "Invalid token." });
  }
};

module.exports = verifyAdmin;
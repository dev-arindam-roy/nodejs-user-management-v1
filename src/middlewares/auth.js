const jwt = require('jsonwebtoken');
require('dotenv').config();

const authenticateToken = (req, res, next) => {
//   const authHeader = req.headers['authorization'];
//   const token = authHeader && authHeader.split(' ')[1];
//   if (!token) return res.status(401).json({ message: 'Access token required' });

//   jwt.verify(token, process.env.JWT_ACCESS_SECRET, (err, payload) => {
//     if (err)
//       return res.status(403).json({ message: 'Invalid or expired token' });
//     req.user = payload; // payload should contain minimal info (e.g. id, email)
//     next();
//   });

const authHeader = req.headers['authorization'];
  if (!authHeader) return res.status(401).json({ message: "Token not pass" });

  const token = authHeader.split(' ')[1]; // after "Bearer"

  if (!token) return res.status(401).json({ message: "Access Token missing" });

  jwt.verify(token, process.env.JWT_SECRET, (err, payload) => {
    if (err) return res.status(403).json({ message: "Invalid or expired token" });

    req.user = payload; // decoded payload
    next();
  });
};

module.exports = { authenticateToken };
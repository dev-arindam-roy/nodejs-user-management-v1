const jwt = require('jsonwebtoken');
require('dotenv').config();

module.exports = {
  generateAccessToken(user) {
    return jwt.sign(
      { id: user.id, email: user.email },
      process.env.JWT_SECRET,
      { expiresIn: process.env.JWT_EXPIRES_IN }
    );
  },
  generateRefreshToken(user) {
    return jwt.sign(
      { id: user.id, email: user.email },
      process.env.JWT_REFRESH_SECRET,
      { expiresIn: process.env.JWT_REFRESH_EXPIRES_IN }
    );
  },
  verifyAccessToken(token) {
    return jwt.verify(token, process.env.JWT_SECRET);
  },
  verifyRefreshToken(token) {
    return new Promise((resolve, reject) => {
      jwt.verify(token, process.env.JWT_REFRESH_SECRET, (err, payload) => {
        if (err) {
          return reject(new Error('Invalid refresh token'));
        }
        resolve(payload);
      });
    });
  },
  verifyRefreshToken2(token) {
    try {
      const payload = jwt.verify(token, process.env.JWT_REFRESH_SECRET);
      return payload;
    } catch (err) {
      return 'Invalid refresh token';
    }
  },
};

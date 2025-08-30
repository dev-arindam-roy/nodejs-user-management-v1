const { User } = require('../database/models');

// this way also we can import
// const bcryptUtil = require("../utils/bcrypt.util");
// const jwtUtil = require("../utils/jwt.util");

const { hash, compare } = require('../utils/bcrypt.util');
const {
  generateAccessToken,
  generateRefreshToken,
  verifyAccessToken,
  verifyRefreshToken,
} = require('../utils/jwt.util');

class AuthController {
  async signup(req, res, next) {
    try {
      const requestData = req.body;
      const hashed = await hash(requestData.password);
      const user = await User.create({
        first_name: requestData.first_name,
        last_name: requestData.last_name,
        email: requestData.email,
        password: hashed,
      });

      // create tokens
      const accessToken = generateAccessToken(user);
      const refreshToken = generateRefreshToken(user);

      // save refresh token (simple approach)
      user.refreshToken = refreshToken;
      await user.save();

      res.status(201).json({ user: user.toJSON(), accessToken, refreshToken });
    } catch (err) {
      next(err);
    }
  }

  async signin(req, res, next) {
    try {
      const requestData = req.body;
      const user = await User.scope(null).findOne({
        where: { email: requestData.email },
      });
      if (!user)
        return res.status(401).json({ message: 'Invalid credentials' });

      const match = await compare(requestData.password, user.password);
      if (!match)
        return res.status(401).json({ message: 'Invalid credentials' });

      const accessToken = generateAccessToken(user);
      const refreshToken = generateRefreshToken(user);

      user.refreshToken = refreshToken;
      await user.save();

      res.json({ user: user.toJSON(), accessToken, refreshToken });
    } catch (err) {
      next(err);
    }
  }

  async createToken(req, res, next) {
    try {
      const { refreshToken } = req.body;
      if (!refreshToken)
        return res.status(400).json({ message: 'Refresh token required' });

      const refreshTokenData = await verifyRefreshToken(refreshToken);

      const user = await User.scope(null).findByPk(refreshTokenData.id);
      if (!user) return res.status(404).json({ message: 'User not found' });

      if (user.refreshToken !== refreshToken)
        return res
          .status(403)
          .json({ message: 'Refresh token does not match' });

      const newAccessToken = generateAccessToken(user);
      const newRefreshToken = generateRefreshToken(user);

      user.refreshToken = newRefreshToken;
      await user.save();

      res.json({
        accessToken: newAccessToken,
        refreshToken: newRefreshToken,
      });
    } catch (err) {
      next(err);
    }
  }

  async logout(req, res, next) {
    try {
      const { refreshToken } = req.body;
      if (!refreshToken)
        return res.status(400).json({ message: 'Refresh token required' });

      // Find user by refresh token and clear it
      const user = await User.scope(null).findOne({ where: { refreshToken } });
      if (!user) {
        res.json({ message: 'user not found, invalid refresh token' });
      }

      user.refreshToken = null;
      await user.save();

      res.json({ message: 'Logged out' });
    } catch (err) {
      next(err);
    }
  }
}

module.exports = AuthController;

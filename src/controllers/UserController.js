const UserService = require('../services/UserService');
const {
  createUserSchema,
  updateUserSchema,
} = require('../validations/userValidation');
const { handleValidation } = require('../utils/validation');
const AppError = require('../utils/AppError');

const userService = new UserService();

class UserController {
  static async register(req, res, next) {
    try {
      const { valid, data } = await handleValidation(
        createUserSchema,
        req.body
      );
      const isEmailExist = await userService.findByEmail(data?.email);
      if (isEmailExist) {
        throw new AppError('logical error', 400, {
          email: 'Email already in use',
        });
      }
      const user = await userService.register(data);
      res.status(201).json({ message: 'User registered successfully', user });
    } catch (error) {
      next(error); // go to global error handler
    }
  }

  static async getAll(req, res, next) {
    try {
      const users = await userService.getAllUsers();
      res.json(users);
    } catch (error) {
      next(error);
    }
  }

  static async getUser(req, res, next) {
    try {
      const user = await userService.getUserById(req.params.id);
      if (!user) {
        throw new AppError('logical error', 400, 'user not found');
      }
      res.json(user);
    } catch (error) {
      next(error);
    }
  }

  static async updateUser(req, res, next) {
    try {
      const userExist = await userService.getUserById(req.params.id);
      if (!userExist) {
        throw new AppError('logical error', 400, 'user not found');
      }
      const { valid, data } = await handleValidation(
        updateUserSchema,
        req.body
      );
      const user = await userService.updateUser(req.params.id, data);
      res.json({ status: 'success', data: user });
    } catch (error) {
      next(error);
    }
  }

  static async userProfileImage(req, res, next) {
    try {
      const result = await userService.uploadProfileImage(req.params.id, req);
      res.status(200).json({
        message: 'Profile image uploaded successfully',
        data: result,
      });
    } catch (error) {
      next(error);
    }
  }
}

module.exports = UserController;

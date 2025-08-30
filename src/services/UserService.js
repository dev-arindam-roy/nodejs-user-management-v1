const bcrypt = require('bcrypt');
const UserRepository = require('../repositories/UserRepository');
const { singleFileUpload } = require('../utils/fileUploader');

class UserService {
  constructor() {
    this.userRepository = new UserRepository();
  }

  async register(userData) {
    const hashedPassword = await bcrypt.hash(userData.password, 10);
    userData.password = hashedPassword;

    return await this.userRepository.create(userData);
  }

  async findByEmail(email) {
    return await this.userRepository.findByEmail(email);
  }

  async getUserById(id) {
    return await this.userRepository.findById(id);
  }

  async getAllUsers() {
    return await this.userRepository.findAll();
  }

  async updateUser(id, userData) {
    return await this.userRepository.update(id, userData);
  }

  async deleteUser(id) {
    return await this.userRepository.delete(id);
  }

  async authenticate(email, password) {
    const user = await this.userRepository.findByEmail(email);
    if (!user) throw new Error('Invalid credentials');

    const isMatch = await bcrypt.compare(password, user.password);
    if (!isMatch) throw new Error('Invalid credentials');

    return user;
  }

  async uploadProfileImage(id, req) {
    const file = await singleFileUpload('profile_image')(req);
    if (!file) {
      throw new Error('No file uploaded');
    }

    const filePath = `${file.filename}`;
    const updatedUser = await this.userRepository.uploadProfileImage(
      id,
      filePath
    );

    if (!updatedUser) {
      throw new Error('User not found');
    }

    return { id: updatedUser.id, profile_image: updatedUser.profile_image };
  }
}

module.exports = UserService;

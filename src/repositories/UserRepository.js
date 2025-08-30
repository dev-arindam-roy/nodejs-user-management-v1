const { User } = require('../database/models');
const IUserRepository = require('../interfaces/IUserRepository');

class UserRepository extends IUserRepository {
  async create(userData) {
    return await User.create(userData);
  }

  async findById(id) {
    return await User.findByPk(id);
  }

  async findByEmail(email) {
    return await User.findOne({ where: { email } });
  }

  async update(id, userData) {
    const user = await User.findByPk(id);
    if (!user) return null;
    return await user.update(userData);
  }

  async delete(id) {
    return await User.destroy({ where: { id } });
  }

  async findAll() {
    return await User.findAll();
  }

  async uploadProfileImage(id, filePath) {
    console.log('🔎 Upload Repo - ID:', id);
    console.log('🔎 File Path:', filePath);

    const user = await User.findByPk(id);
    console.log('🔎 User Found:', user ? user.toJSON() : null);

    if (!user) return null;

    const updated = await user.update({ profile_image: filePath });
    console.log('✅ Updated User:', updated.toJSON());

    return updated;
  }
}

module.exports = UserRepository;

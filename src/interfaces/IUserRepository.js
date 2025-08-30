
class IUserRepository {
  async create(userData) {
    throw new Error("Method not implemented.");
  }

  async findById(id) {
    throw new Error("Method not implemented.");
  }

  async findByEmail(email) {
    throw new Error("Method not implemented.");
  }

  async update(id, userData) {
    throw new Error("Method not implemented.");
  }

  async delete(id) {
    throw new Error("Method not implemented.");
  }

  async findAll() {
    throw new Error("Method not implemented.");
  }

  async uploadProfileImage(id, filePath) {
    throw new Error("Method not implemented.");
  }
}

module.exports = IUserRepository;

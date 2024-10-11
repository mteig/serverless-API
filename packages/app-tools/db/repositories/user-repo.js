import { dbReady, dbManager } from '../database-manager.js';

class UserRepo {
  async getUser(email) {
    await dbReady;
    return dbManager.getModels().Users.findOne({ where: { email } });
  }

  async getUserById(id) {
    await dbReady;
    return dbManager.getModels().Users.findOne({ where: { userid: id } });
  }

  async updateUser(user) {
    await dbReady;
    return dbManager
      .getModels()
      .Users.update(user, { where: { userid: user.userid } });
  }
}

export default UserRepo;

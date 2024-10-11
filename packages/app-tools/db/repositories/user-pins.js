import { dbReady, dbManager } from '../database-manager.js';

class UserPinsRepo {
  async getUserPins(userId) {
    await dbReady;
    return dbManager.getModels().UserPins.findAll({
      where: {
        userid: userId,
      },
    });
  }

  async deleteUserPins(userId) {
    await dbReady;
    return dbManager.getModels().UserPins.destroy({
      where: {
        userid: userId,
      },
    });
  }
}

export default UserPinsRepo;

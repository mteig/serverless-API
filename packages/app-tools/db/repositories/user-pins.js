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

  async getUserPin(userid) {
    await dbReady;
    return dbManager.getModels().UserPins.findOne({
      where: {
        userid,
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

  async createUserPin(userid, pin) {
    await dbReady;
    return dbManager.getModels().UserPins.create({
      userid,
      pin,
    });
  }
}

export default UserPinsRepo;

import { dbReady, dbManager } from '../database-manager.js';

class MessageRepo {
  async findMessage(params) {
    await dbReady;
    return dbManager.getModels().Messages.findOne({ where: params });
  }
}

export default MessageRepo;

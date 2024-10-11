import UserRepo from './user-repo.js';
import MessageRepo from './message-repo.js';
import UserPinsRepo from './user-pins.js';

class RepositoryFactory {
  getUserRepo() {
    return new UserRepo();
  }

  getMessageRepo() {
    return new MessageRepo();
  }

  getUserPinsRepo() {
    return new UserPinsRepo();
  }
}

export default RepositoryFactory;

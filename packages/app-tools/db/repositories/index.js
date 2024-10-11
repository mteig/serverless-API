import UserRepo from './user-repo.js';
import MessageRepo from './message-repo.js';

class RepositoryFactory {
  getUserRepo() {
    return new UserRepo();
  }

  getMessageRepo() {
    return new MessageRepo();
  }
}

export default RepositoryFactory;

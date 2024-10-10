import UserRepo from './user-repo.js';

class RepositoryFactory {
  getUserRepo() {
    return new UserRepo();
  }
}

export default RepositoryFactory;

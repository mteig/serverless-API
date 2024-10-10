import {
  SecretsManagerClient,
  GetSecretValueCommand,
} from '@aws-sdk/client-secrets-manager';
import { Sequelize } from 'sequelize';
import mysql2 from 'mysql2';
import { log } from '../utils/log.js';
import CONSTANTS from '../utils/constants.js';
import Alerts from './models/alerts.js';
import Contacts from './models/contacts.js';
import Logs from './models/logs.js';
import Messages from './models/messages.js';
import UserPins from './models/user-pins.js';
import Users from './models/users.js';
import RefreshTokens from './models/refresh-tokens.js';

const secretsManager = new SecretsManagerClient({
  region: process.env.AWS_REGION,
});

let dbInitializationPromise;
let sequelize;
let models;

async function initializeDbConnection() {
  if (!dbInitializationPromise) {
    dbInitializationPromise = (async () => {
      const dbConfig = await getDbConfig();
      const { database, username, password, host, dialect } = dbConfig;

      sequelize = new Sequelize(database, username, password, {
        host,
        dialect,
        dialectModule: mysql2,
        dialectOptions: {
          ssl: {
            require: true,
            rejectUnauthorized: false,
          },
        },
      });

      models = {
        Alerts: Alerts(sequelize, Sequelize),
        Contacts: Contacts(sequelize, Sequelize),
        Logs: Logs(sequelize, Sequelize),
        Messages: Messages(sequelize, Sequelize),
        UserPins: UserPins(sequelize, Sequelize),
        Users: Users(sequelize, Sequelize),
        RefreshTokens: RefreshTokens(sequelize, Sequelize),
      };

      // Set up associations
      for (const modelName of Object.keys(models)) {
        if (models[modelName].associate) {
          models[modelName].associate(models);
        }
      }

      log.info(
        { success: true, host, database },
        'Database initialization complete'
      );
    })();
  }

  return dbInitializationPromise;
}

async function getDbConfig() {
  const CredsCommand = new GetSecretValueCommand({
    SecretId: CONSTANTS.DB_CREDENTIALS_NAME,
  });
  const ConfigCommand = new GetSecretValueCommand({
    SecretId: CONSTANTS.DB_SETTINGS_NAME,
  });
  const [CredsResponse, ConfigResponse] = await Promise.all([
    secretsManager.send(CredsCommand),
    secretsManager.send(ConfigCommand),
  ]);
  const settings = JSON.parse(ConfigResponse.SecretString);
  const credentials = JSON.parse(CredsResponse.SecretString);
  return {
    ...credentials,
    ...settings,
  };
}

class DatabaseManager {
  constructor() {
    this.ready = initializeDbConnection()
      .then(() => {
        log.info('Database initialized');
        Object.freeze(this);
        return this;
      })
      .catch((error) => {
        log.error(error, 'Database initialization failed');
        throw error;
      });
  }

  getModels() {
    return models;
  }

  getSequelize() {
    return sequelize;
  }

  async createTransaction() {
    await this.ready;
    log.info('Creating transaction');
    return sequelize.transaction();
  }
}

const dbManager = new DatabaseManager();
const dbReady = dbManager.ready;
export { dbManager, dbReady };

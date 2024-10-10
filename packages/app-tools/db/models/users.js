const Users = (sequelize, Sequelize) => {
  const { DataTypes } = Sequelize;
  return sequelize.define(
    'Users',
    {
      userid: {
        type: DataTypes.INTEGER,
        primaryKey: true,
        autoIncrement: true,
        allowNull: false,
      },
      usertype: {
        type: DataTypes.INTEGER,
        allowNull: false,
        defaultValue: 0,
      },
      email: {
        type: DataTypes.STRING(50),
        allowNull: false,
      },
      password: {
        type: DataTypes.STRING(50),
        allowNull: false,
      },
      username: {
        type: DataTypes.STRING(50),
        allowNull: true,
      },
      phone: {
        type: DataTypes.STRING(25),
        allowNull: true,
      },
      lng: {
        type: DataTypes.STRING(25),
        allowNull: true,
        defaultValue: 0,
      },
      longitude: {
        type: DataTypes.STRING(50),
        allowNull: true,
        defaultValue: 0,
      },
      lat: {
        type: DataTypes.STRING(25),
        allowNull: true,
        defaultValue: 0,
      },
      latitude: {
        type: DataTypes.STRING(50),
        allowNull: true,
      },
      device_token: {
        type: DataTypes.TEXT,
        allowNull: true,
      },
      tag: {
        type: DataTypes.STRING(20),
        allowNull: true,
      },
      address: {
        type: DataTypes.STRING(128),
        allowNull: true,
      },
      status: {
        type: DataTypes.INTEGER,
        allowNull: false,
        defaultValue: 0,
      },
      crowdstatus: {
        type: DataTypes.STRING,
        allowNull: false,
        defaultValue: 0,
      },
      datetime: {
        type: DataTypes.STRING(20),
        allowNull: true,
      },
      last_refresh_time: {
        type: DataTypes.STRING(25),
        allowNull: true,
      },
      image: {
        type: DataTypes.STRING(100),
        allowNull: true,
      },
      loginstatus: {
        type: DataTypes.INTEGER,
        allowNull: true,
      },
      badge_count: {
        type: DataTypes.INTEGER,
        allowNull: true,
        defaultValue: 0,
      },
    },
    {
      timestamps: true,
      paranoid: false,
      modelName: 'Users',
      tableName: 'tbl_registration',
      createdAt: 'created_on',
      updatedAt: 'modified',
    }
  );
};

export default Users;

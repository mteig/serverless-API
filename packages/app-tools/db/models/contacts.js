const Contacts = (sequelize, Sequelize) => {
  const { DataTypes } = Sequelize;
  return sequelize.define(
    'Contacts',
    {
      user_id: {
        type: DataTypes.INTEGER,
        primaryKey: true,
        autoIncrement: true,
        allowNull: false,
      },
      created_user_id: {
        type: DataTypes.INTEGER,
        allowNull: true,
      },
      firstname: {
        type: DataTypes.TEXT,
        allowNull: true,
      },
      lastname: {
        type: DataTypes.TEXT,
        allowNull: true,
      },
      nickname: {
        type: DataTypes.TEXT,
        allowNull: true,
      },
      email: {
        type: DataTypes.STRING(256),
        allowNull: true,
      },
      phone: {
        type: DataTypes.STRING(20),
        allowNull: true,
      },
      address: {
        type: DataTypes.STRING(512),
        allowNull: true,
      },
      status: {
        type: DataTypes.CHAR(1),
        allowNull: true,
      },
      user_device_token: {
        type: DataTypes.STRING(256),
        allowNull: true,
      },
      user_tag: {
        type: DataTypes.STRING(32),
        allowNull: true,
      },
    },
    {
      timestamps: true,
      paranoid: false,
      modelName: 'Contacts',
      tableName: 'add_new',
      createdAt: 'created',
      updatedAt: 'modified',
    }
  );
};

export default Contacts;

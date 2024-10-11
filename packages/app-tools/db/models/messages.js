const Messages = (sequelize, Sequelize) => {
  const { DataTypes } = Sequelize;
  return sequelize.define(
    'Messages',
    {
      uniqueid: {
        type: DataTypes.INTEGER,
        primaryKey: true,
        autoIncrement: true,
        allowNull: false,
      },
      language: {
        type: DataTypes.STRING(32),
        allowNull: false,
      },
      language_code: {
        type: DataTypes.STRING(32),
        allowNull: false,
      },
      message: {
        type: DataTypes.TEXT,
        allowNull: false,
      },
      message_code: {
        type: DataTypes.STRING(32),
        allowNull: false,
      },
      subject: {
        type: DataTypes.STRING(256),
        allowNull: true,
      },
    },
    {
      timestamps: true,
      paranoid: false,
      modelName: 'Messages',
      tableName: 'messages',
      createdAt: 'created_at',
      updatedAt: 'modified',
      indexes: [
        {
          fields: ['message_code', 'language_code'],
          unique: true,
        },
      ],
    }
  );
};

export default Messages;

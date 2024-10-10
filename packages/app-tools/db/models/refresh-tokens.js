const RefreshTokens = (sequelize, Sequelize) => {
  const { DataTypes } = Sequelize;
  return sequelize.define(
    'RefreshTokens',
    {
      id: {
        type: DataTypes.INTEGER,
        primaryKey: true,
        autoIncrement: true,
        allowNull: false,
      },
      userId: {
        type: DataTypes.INTEGER,
        allowNull: false,
      },
      refreshToken: {
        type: DataTypes.STRING(255),
        allowNull: false,
      },
      enabled: {
        type: DataTypes.BOOLEAN,
        allowNull: false,
      },
    },
    {
      timestamps: true,
      paranoid: false,
      modelName: 'RefreshTokens',
      tableName: 'tbl_refresh_tokens',
      createdAt: 'created',
      updatedAt: 'modified',
    }
  );
};

export default RefreshTokens;

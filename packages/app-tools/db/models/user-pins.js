const UserPins = (sequelize, Sequelize) => {
  const { DataTypes } = Sequelize;
  return sequelize.define(
    'UserPins',
    {
      id: {
        type: DataTypes.INTEGER,
        primaryKey: true,
        autoIncrement: true,
        allowNull: false,
      },
      userid: {
        type: DataTypes.INTEGER,
        allowNull: true,
      },
      pin: {
        type: DataTypes.STRING(100),
        allowNull: true,
      },
    },
    {
      timestamps: true,
      paranoid: false,
      modelName: 'UserPins',
      tableName: 'tbl_userpin',
      createdAt: 'created_on',
      updatedAt: 'modified',
    }
  );
};

export default UserPins;

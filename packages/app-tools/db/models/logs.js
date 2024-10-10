const Logs = (sequelize, Sequelize) => {
  const { DataTypes } = Sequelize;
  return sequelize.define(
    'Logs',
    {
      id: {
        type: DataTypes.INTEGER,
        primaryKey: true,
        autoIncrement: true,
        allowNull: false,
      },
      message: {
        type: DataTypes.TEXT,
        allowNull: true,
      },
    },
    {
      timestamps: true,
      paranoid: false,
      modelName: 'Logs',
      tableName: 'Logs',
      createdAt: 'created_at',
      updatedAt: 'time',
    }
  );
};

export default Logs;

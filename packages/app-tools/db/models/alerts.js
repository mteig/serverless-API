const Alerts = (sequelize, Sequelize) => {
  const { DataTypes } = Sequelize;
  return sequelize.define(
    'Alerts',
    {
      fld_help_id: {
        type: DataTypes.INTEGER,
        primaryKey: true,
        autoIncrement: true,
        allowNull: false,
      },
      recieveremail: {
        type: DataTypes.STRING(255),
        allowNull: true,
      },
      email: {
        type: DataTypes.STRING(90),
        allowNull: true,
      },
      username: {
        type: DataTypes.STRING(90),
        allowNull: true,
      },
      image: {
        type: DataTypes.STRING(200),
        allowNull: true,
      },
      address: {
        type: DataTypes.STRING(255),
        allowNull: true,
      },
      latitude: {
        type: DataTypes.STRING(255),
        allowNull: true,
      },
      longitude: {
        type: DataTypes.STRING(255),
        allowNull: true,
      },
      phone: {
        type: DataTypes.STRING(25),
        allowNull: true,
      },
      datetime: {
        type: DataTypes.DATE,
        allowNull: true,
      },
      status: {
        type: DataTypes.INTEGER,
        allowNull: true,
      },
      timezone: {
        type: DataTypes.STRING(256),
        allowNull: true,
      },
      alert_type: {
        type: DataTypes.INTEGER,
        allowNull: true,
      },
    },
    {
      timestamps: true,
      paranoid: false,
      modelName: 'Alerts',
      tableName: 'tbl_help',
      createdAt: 'created_at',
      updatedAt: 'modified',
    }
  );
};

export default Alerts;

module.exports = function(sequelize, DataTypes){
  let model = sequelize.define("Notice", {
      noticeId: {
          type: DataTypes.INTEGER,
          autoIncrement: true,
          primaryKey: true,
      },
      classId: {
          type: DataTypes.INTEGER,
          allowNull: false
      },
      title: {
          type: DataTypes.STRING(50),
          allowNull: false
      },
      body: {
        type: DataTypes.STRING(200),
        allowNull: false
      },
      writtenDate: {
        type: DataTypes.DATE,
        defaultValue: DataTypes.NOW
      }
  }, {
      underscored: true,
      freezeTableName: true
  });
  model.associate = function(models){
      model.belongsTo(models.Class, {
          foreignKey: "classId",
      })
  }
  return model;
}


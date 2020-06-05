module.exports = function(sequelize, DataTypes){
  let model = sequelize.define("Presentation", {
      presentationId: {
        type: DataTypes.INTEGER,
        autoIncrement: true,
        primaryKey: true,
        allowNull: false
      },
      classId: {
          type: DataTypes.INTEGER,
          allowNull: false
      },
      lectureId: {
          type: DataTypes.INTEGER,
          allowNull: false
      },
      teamId: {
        type: DataTypes.INTEGER,
        allowNull: false
      },
      userId: {
        type: DataTypes.STRING(50),
        allowNull: false,
      },
      startedAt: {
        type: DataTypes.DATE,
        allowNull: false,
        defaultValue: DataTypes.NOW 
      },
      endedAt: {
        type: DataTypes.DATE,
        allowNull: true,
      }
  }, {
      underscored: true,
      freezeTableName: true
  });
  model.associate = function(models){
    model.belongsTo(models.Class, {
        foreignKey: "classId",
    })
    model.belongsTo(models.Lecture, {
      foreignKey: "lectureId",
    })
    model.belongsTo(models.Team, {
      foreignKey: "teamId",
  })

  }    
  return model;
}


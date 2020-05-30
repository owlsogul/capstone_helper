module.exports = function(sequelize, DataTypes){
  let model = sequelize.define("Lecture", {
      lectureId: {
          type: DataTypes.INTEGER,
          autoIncrement: true,
          primaryKey: true,
          allowNull: false
      },
      classId: {
          type: DataTypes.INTEGER,
          allowNull: false
      },
      lectureName: {
        type: DataTypes.STRING(50),
        allowNull: false,
        defaultValue: "nst lecture"
      },
      lectureLink: {
        type: DataTypes.STRING(50),
        allowNull: true
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
  }    
  return model;
}


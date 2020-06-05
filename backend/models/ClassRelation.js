/**
 * type 
 * wait: 0
 * take: 1
 * manage 2
 * own : 3
 */
module.exports = function(sequelize, DataTypes){
  let model = sequelize.define("ClassRelation", {
      classId: {
          type: DataTypes.INTEGER,
          allowNull: false
      },
      user: {
          type: DataTypes.STRING(50),
          allowNull: false
      },
      relationType: {
          type: DataTypes.INTEGER,
          allowNull: false,
          defaultValue: 0
      }
  }, {
      underscored: true,
      freezeTableName: true
  });
  model.associate = function(models){
      model.belongsTo(models.User, {
          foreignKey: "user",
      })
      model.belongsTo(models.Class, {
          foreignKey: "classId",
      })
  }    
  return model;
}


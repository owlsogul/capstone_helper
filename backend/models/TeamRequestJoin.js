module.exports = function(sequelize, DataTypes){
  let model = sequelize.define("Join", {
    requestId: {
      type: DataTypes.INTEGER,
      autoIncrement: true,
      primaryKey: true,
    },
    targetTeam: {
        type: DataTypes.INTEGER,
        allowNull: false
    },
    user: {
        type: DataTypes.STRING(50),
        allowNull: false
    }
  }, {
      underscored: true,
      freezeTableName: true
  });
  model.associate = function(models){
      model.belongsTo(models.User, {
          foreignKey: "user",
      })
      model.belongsTo(models.Team, {
          foreignKey: "targetTeam",
      })
  }    
  return model;
}


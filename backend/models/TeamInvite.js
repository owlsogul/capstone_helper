module.exports = function(sequelize, DataTypes){
  let model = sequelize.define("Join", {
    inviteId: {
      type: DataTypes.INTEGER,
      autoIncrement: true,
      primaryKey: true,
    },
    teamId: {
        type: DataTypes.INTEGER,
        allowNull: false
    },
    targetMember: {
        type: DataTypes.STRING(50),
        allowNull: false
    }
  }, {
      underscored: true,
      freezeTableName: true
  });
  model.associate = function(models){
      model.belongsTo(models.User, {
          foreignKey: "targetMember",
      })
      model.belongsTo(models.Team, {
          foreignKey: "teamId",
      })
  }    
  return model;
}


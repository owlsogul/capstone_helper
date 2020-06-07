module.exports = function(sequelize, DataTypes){
  let model = sequelize.define("FeedbackReply", {
      replyId: {
        type: DataTypes.INTEGER,
        autoIncrement: true,
        primaryKey: true,
        allowNull: false
      },
      postId: {
          type: DataTypes.INTEGER,
          allowNull: false
      },
      teamId: {
          type: DataTypes.INTEGER,
          allowNull: false
      },
      targetTeamId: {
          type: DataTypes.INTEGER,
          allowNull: false
      },
      body: {
          type: DataTypes.TEXT,
          allowNull: false,
      }
  }, {
      underscored: true,
      freezeTableName: true
  });
  model.associate = function(models){
      model.belongsTo(models.FeedbackPost, {
          foreignKey: "postId",
      })
      model.belongsTo(models.Team, {
          foreignKey: "teamId",
      })
      model.belongsTo(models.Team, {
          foreignKey: "targetTeamId",
      })
  }    
  return model;
}


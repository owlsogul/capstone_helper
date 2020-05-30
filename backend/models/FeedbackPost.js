module.exports = function(sequelize, DataTypes){
  let model = sequelize.define("FeedbackPost", {
      postId: {
        type: DataTypes.INTEGER,
        autoIncrement: true,
        primaryKey: true,
        allowNull: false
      },
      formId: {
        type: DataTypes.INTEGER,
        allowNull: false
      },
      classId: {
          type: DataTypes.INTEGER,
          allowNull: false
      },
      title: {
          type: DataTypes.STRING(50),
          allowNull: false,
      },
      expiredDate: {
        type: DataTypes.DATE,
        allowNull: false
      }
  }, {
      underscored: true,
      freezeTableName: true
  });
  model.associate = function(models){
      model.belongsTo(models.FeedbackForm, {
          foreignKey: "formId",
      })
      model.belongsTo(models.Class, {
          foreignKey: "classId",
      })
  }    
  return model;
}


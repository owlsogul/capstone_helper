module.exports = function(sequelize, DataTypes){
  let model = sequelize.define("FeedbackForm", {
      formId: {
        type: DataTypes.INTEGER,
        autoIncrement: true,
        primaryKey: true,
        allowNull: false
      },
      classId: {
          type: DataTypes.INTEGER,
          allowNull: false
      },
      name: {
          type: DataTypes.STRING(50),
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
      model.belongsTo(models.Class, {
          foreignKey: "classId",
      })
  }    
  return model;
}


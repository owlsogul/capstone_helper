module.exports = function(sequelize, DataTypes){
    let model = sequelize.define("Team", {
        teamId: {
            type: DataTypes.INTEGER,
            autoIncrement: true,
            primaryKey: true,
            allowNull: false
        },
        classId: {
            type: DataTypes.INTEGER,
            allowNull: false
        },
        teamName: {
            type: DataTypes.STRING(50),
            allowNull: false
        },
        githubUrl: {
          type: DataTypes.STRING(100),
          allowNull: true
        }
    }, {
        underscored: true,
        freezeTableName: true
    });
    model.associate = function(models){
        model.belongsTo(models.Class, {
            foreignKey: "classId",
        })
        model.hasMany(models.Join, {
          foreignKey: "teamId"
        })
    }
    return model;
}


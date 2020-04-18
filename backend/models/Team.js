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


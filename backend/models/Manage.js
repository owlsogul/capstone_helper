module.exports = function(sequelize, DataTypes){
    let model = sequelize.define("Manage", {
        classId: {
            type: DataTypes.INTEGER,
            allowNull: false
        },
        user: {
            type: DataTypes.STRING(50),
            allowNull: false
        },
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


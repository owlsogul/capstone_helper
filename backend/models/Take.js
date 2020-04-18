module.exports = function(sequelize, DataTypes){
    let model = sequelize.define("Take", {
        classId: {
            type: DataTypes.INTEGER,
            allowNull: false
        },
        user: {
            type: DataTypes.STRING(50),
            allowNull: false
        },
        takeStatus: {
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


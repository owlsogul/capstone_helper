module.exports = function(sequelize, DataTypes){
    let model = sequelize.define("UserAuthData", {
        user: {
            type: DataTypes.STRING(50),
            primaryKey: true,
            allowNull: false
        },
        authLink: {
            type: DataTypes.STRING(50),
            primaryKey: true,
            allowNull: false
        },
        expireDate: {
            type: DataTypes.DATE,
            allowNull: false
        },
    }, {
        underscored: true,
        freezeTableName: true
    });
    model.associate = function(models){
        model.belongsTo(models.User, {
            foreignKey: "user",
            onDelete: "cascade",
        })
    }    
    return model;
}


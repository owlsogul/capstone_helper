module.exports = function(sequelize, DataTypes){
    let model = sequelize.define("StudentMeta", {
        user: {
            type: DataTypes.STRING(50),
            primaryKey: true,
            allowNull: false
        },
        studentCode: {
            type: DataTypes.STRING(10),
            primaryKey: true,
            allowNull: false
        }
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


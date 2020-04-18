module.exports = function(sequelize, DataTypes){
    let model = sequelize.define("ProfessorMeta", {
        user: {
            type: DataTypes.STRING(50),
            primaryKey: true,
            allowNull: false
        },
        phoneNumber: {
            type: DataTypes.STRING(20),
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


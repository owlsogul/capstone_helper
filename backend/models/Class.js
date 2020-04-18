module.exports = function(sequelize, DataTypes){
    let model = sequelize.define("Class", {
        classId: {
            type: DataTypes.INTEGER,
            autoIncrement: true,
            primaryKey: true,
            allowNull: false
        },
        professor: {
            type: DataTypes.STRING(50),
            allowNull: false
        },
        className: {
            type: DataTypes.STRING(50),
            allowNull: false
        }
    }, {
        underscored: true,
        freezeTableName: true
    });
    model.associate = function(models){
        model.belongsTo(models.User, {
            foreignKey: "professor",
        })
    }    
    return model;
}


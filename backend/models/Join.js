module.exports = function(sequelize, DataTypes){
    let model = sequelize.define("Join", {
        classId: {
            type: DataTypes.INTEGER,
            allowNull: false
        },
        teamId: {
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
        },
        isLeader: {
            type: DataTypes.BOOLEAN,
            allowNull: false,
            defaultValue: false
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
        model.belongsTo(models.Team, {
            foreignKey: "teamId",
        })
    }    
    return model;
}


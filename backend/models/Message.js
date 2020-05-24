module.exports = function(sequelize, DataTypes){
    let model = sequelize.define("Message", {
        msgId: {
            type: DataTypes.INTEGER,
            autoIncrement: true,
            primaryKey: true,
        },
        msgType: {
            type: DataTypes.INTEGER,
            defaultValue: 0
        },
        classId: {
            type: DataTypes.INTEGER,
            allowNull: false
        },
        sender: {
            type: DataTypes.STRING(50),
            allowNull: false
        },
        body: {
            type: DataTypes.TEXT,
            allowNull: false
        },
    }, {
        underscored: true,
        freezeTableName: true
    });
    model.associate = function(models){
        model.belongsTo(models.User, {
            foreignKey: "sender",
        })
        model.belongsTo(models.Class, {
            foreignKey: "classId",
        })
    }    
    return model;
}


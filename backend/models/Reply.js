module.exports = function(sequelize, DataTypes){
    let model = sequelize.define("Reply", {
        classId: {
            type: DataTypes.INTEGER,
            allowNull: false
        },
        msgType: {
            type: DataTypes.INTEGER,
            defaultValue: 1
        },
        sender: {
            type: DataTypes.STRING(50),
            allowNull: false
        },
        receiver: {
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
        model.belongsTo(models.User, {
            foreignKey: "receiver",
        })
        model.belongsTo(models.Class, {
            foreignKey: "classId",
        })
    }    
    return model;
}


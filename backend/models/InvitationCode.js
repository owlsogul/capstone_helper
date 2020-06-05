module.exports = function(sequelize, DataTypes){
    let model = sequelize.define("InvitationCode", {
        code: {
            type: DataTypes.STRING(50),
            primaryKey: true,
            allowNull: false
        },
        classId: {
            type: DataTypes.INTEGER,
            allowNull: false
        },
        expiredDate: {
            type: DataTypes.DATE,
            allowNull: false
        },
        isAutoJoin: {
            type: DataTypes.BOOLEAN,
            allowNull: false,
            defaultValue: true
        },
        isAssist: {
          type: DataTypes.BOOLEAN,
          allowNull: false,
          defaultValue: false
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


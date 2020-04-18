module.exports = function(sequelize, DataTypes){
    let model = sequelize.define("User", {
        email: {
            type: DataTypes.STRING(50),
            primaryKey: true,
            allowNull: false
        },
        password: {
            type: DataTypes.STRING,
            allowNull: false
        },
        salt: {
          type: DataTypes.STRING
        },
        name: {
            type: DataTypes.STRING(30),
            allowNull: false
        },
        level: {
            type: DataTypes.INTEGER,
            defaultValue: 0,
            allowNull: false
        }

    }, {
        underscored: true,
        freezeTableName: true
    });
    return model;
}
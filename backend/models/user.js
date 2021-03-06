/**
 * User.level 에 관하여
 * 0 은 학생 가입. 메일 인증 전
 * 1 은 학생 가입 메일 인증 완료
 * 50 은 조교로 올라갔을 때
 * 100 은 교수 가입. 인증 전
 * 101 은 교수 가입. 인증 완료
 */

module.exports = function(sequelize, DataTypes){
    let model = sequelize.define("User", {
        userId: {
            type: DataTypes.STRING(50),
            primaryKey: true,
            allowNull: false
        },
        userPw: {
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
    model.associate = function(models){
        model.hasMany(models.Presentation, {
            foreignKey: "userId"
        })
        model.hasMany(models.Join, {
          foreignKey: "user"
        })
        model.hasMany(models.ClassRelation, {
            foreignKey: "user"
        })
    }
    return model;
}
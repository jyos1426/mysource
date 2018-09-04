module.exports = function (sequelize, DataTypes) {
    const user = sequelize.define('User', {
        email: {
            field: 'email',
            type: DataTypes.STRING(50),
            unique: true,
            allowNull: false
        },
        password: {
            field: 'password',
            type: DataTypes.STRING(30),
            allowNull: false
        },
    }, {
        underscored: true,
        freezeTableName: true,
        tableName: 'user'
    });

    return user;
};
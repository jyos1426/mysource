module.exports = function (sequelize, DataTypes) {
    const memo = sequelize.define('Memo', {
        id: {
            field: 'id',
            type: DataTypes.INTEGER,
            autoIncrement: true,
            primaryKey: true
        },
        email: {
            field: 'email',
            type: DataTypes.STRING(30),
            unique: false,
            allowNull: false
        },
        body: {
            field: 'body',
            type: DataTypes.STRING(200),
            allowNull: false
        },
    }, {
        underscored: true,
        freezeTableName: true,
        tableName: 'memo'
    });

    return memo;
};
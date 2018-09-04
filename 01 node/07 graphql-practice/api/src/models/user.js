export default (sequelize, DataTypes) => {
  const user = sequelize.define('User', {
    email: {
      field: 'email',
      type: DataTypes.STRING,
      unique: true,
      allowNull: false
    },
    password: {
      field: 'password',
      type: DataTypes.STRING,
      allowNull: false
    },
  }, {
    underscored: true,
    freezeTableName: true,
    tableName: 'user'
  });

  return user;
}
export default (sequelize, DataTypes) => {
  const thoughts = sequelize.define('thoughts', {
    name: {
      type: DataTypes.STRING
    },
    thought: {
      type: DataTypes.TEXT
    }
  });
  
  return thoughts;
}
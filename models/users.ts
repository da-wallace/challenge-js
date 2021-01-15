import { Model } from 'sequelize';
export default function (sequelize, DataTypes) {
  class users extends Model {
    /**
     * Helper method for defining associations.
     * This method is not a part of Sequelize lifecycle.
     * The `models/index` file will call this method automatically.
     */
    static associate(models) {
      this.hasMany(models.messages);
      // define association here
    }
  }
  users.init(
    {
      username: { type: DataTypes.STRING, unique: true }
    },
    {
      sequelize,
      modelName: 'users'
    }
  );
  return users;
}

import { Model } from 'sequelize';

export default function (sequelize, DataTypes) {
  class messages extends Model {
    /**
     * Helper method for defining associations.
     * This method is not a part of Sequelize lifecycle.
     * The `models/index` file will call this method automatically.
     */
    static associate(models) {
      this.belongsTo(models.users);
      this.hasMany(models.metadata);
      // define association here
    }
  }
  messages.init(
    {
      userId: DataTypes.INTEGER,
      content: DataTypes.TEXT
    },
    {
      sequelize,
      modelName: 'messages'
    }
  );
  return messages;
}

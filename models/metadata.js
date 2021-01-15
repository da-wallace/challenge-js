'use strict';
import { Model } from 'sequelize';

export default function (sequelize, DataTypes) {
  class metadata extends Model {
    /**
     * Helper method for defining associations.
     * This method is not a part of Sequelize lifecycle.
     * The `models/index` file will call this method automatically.
     */
    static associate(models) {
      this.belongsTo(models.messages);
      // define association here
    }
  }
  metadata.init(
    {
      description: DataTypes.STRING,
      icon: DataTypes.STRING,
      image: DataTypes.STRING,
      title: DataTypes.STRING,
      keywords: DataTypes.STRING,
      provider: DataTypes.STRING,
      type: DataTypes.STRING,
      url: DataTypes.STRING
    },
    {
      sequelize,
      modelName: 'metadata'
    }
  );
  return metadata;
}

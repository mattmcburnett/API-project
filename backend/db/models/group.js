'use strict';
const {
  Model
} = require('sequelize');
module.exports = (sequelize, DataTypes) => {
  class Group extends Model {
    /**
     * Helper method for defining associations.
     * This method is not a part of Sequelize lifecycle.
     * The `models/index` file will call this method automatically.
     */
    static associate(models) {
      // define association here
      Group.hasMany(
        models.Event,
        { foreignKey: 'groupId', onDelete: 'CASCADE', hooks: true }
      );

      Group.hasMany(
        models.Venue,
        { foreignKey: 'groupId', onDelete: 'CASCADE', hooks: true }
      );

      Group.hasMany(
        models.GroupImage,
        { foreignKey: 'groupId', onDelete: 'CASCADE', hooks: true }
      );

      Group.hasMany(
        models.Membership,
        { foreignKey: 'groupId', onDelete: 'CASCADE', hooks: true }
      );

      Group.belongsTo(
        models.User,
        { foreignKey: 'organizerId'}
      );
    }
  }
  Group.init({
    organizerId: {
      type: DataTypes.INTEGER,
      allowNull: false,
      references: {
        model: 'Users',
        key: 'id'
      }
    },
    name: {
      type: DataTypes.STRING,
      allowNull: false
    },
    about: {
      type: DataTypes.TEXT,
      allowNull: false
    },
    type: {
      type: DataTypes.ENUM('In Person', 'Online'),
      allowNull: false,
      defaultValue: 'In Person'
    },
    private: {
      type: DataTypes.BOOLEAN,
      allowNull: false,
      defaultValue: true
    },
    city: {
      type: DataTypes.STRING,
    },
    state: DataTypes.STRING
  }, {
    sequelize,
    modelName: 'Group',
  });
  return Group;
};

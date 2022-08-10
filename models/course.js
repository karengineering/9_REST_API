'use strict';
// const Sequelize = require('sequelize');
const { Model, DataTypes } = require('sequelize');
const bcrypt = require('bcryptjs');

module.exports = (sequelize) => {
//   class Course extends Sequelize.Model {}
  class Course extends Model {}
  Course.init({
    id: {
      type: DataTypes.INTEGER,
      primaryKey: true,
      autoIncrement: true,
    },
    title: {
        type: DataTypes.STRING,
        allowNull: false,
        validate: {
            notNull: {
                msg: "A title is required"
            },
            notEmpty: {
                msg: "Please provide a title"
            }
    }
},
    description: {
        type: DataTypes.STRING,
        allowNull: false,
        validate: {
            notNull: {
                msg: "A description is required"
            },
            notEmpty: {
                msg: "Please provide a description"
            }
    }
},
    estimatedTime: {
        type: DataTypes.STRING
        // type: Sequelize.STRING,
        // allowNull: false,
      },
    materialsNeeded: {
        type: DataTypes.STRING
        // type: Sequelize.STRING,
        // allowNull: false,
    },
      
  }, { sequelize });

  Course.associate = (models) => {
    Course.belongsTo(models.User, {
      as: 'user',
      foreignKey: {
        fieldName: 'userId',
        allowNull: false,
      },
    });
  };

  return Course;
};

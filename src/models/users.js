import bcrypt from 'bcryptjs'

module.exports = function (sequelize, DataTypes) {
  var User = sequelize.define('User', {
    id: {
      type: DataTypes.INTEGER(10),
      allowNull: false,
      primaryKey: true,
      autoIncrement: true
    },
    name: {
      type: DataTypes.STRING,
      allowNull: false,
      unique: true
    },
    email: {
      type: DataTypes.STRING,
      allowNull: false,
      unique: true
    },
    password: {
      type: DataTypes.STRING,
      allowNull: false,
      set: function (val) {
        this.setDataValue('password', bcrypt.hashSync(val, 8))
      }
    },
    created_at: {
      type: DataTypes.DATE,
      allowNull: true
    },
    updated_at: {
      type: DataTypes.DATE,
      allowNull: true
    }
  }, {
    classMethods: {
      associate: function (models) {
        User.belongsToMany(models.Role, {through: 'role_user'})
      }
    },
    instanceMethods: {
      authenticate: function (value) {
        if (bcrypt.compareSync(value, this.password)) {
          return true
        } else {
          return false
        }
      }
    },
    underscored: true,
    tableName: 'users'
  })

  return User
}

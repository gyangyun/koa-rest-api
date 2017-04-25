module.exports = function (sequelize, DataTypes) {
  var Role = sequelize.define('Role', {
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
    display_name: {
      type: DataTypes.STRING,
      allowNull: true
    },
    description: {
      type: DataTypes.STRING,
      allowNull: true
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
        Role.belongsToMany(models.User, {through: 'role_user'})
        Role.belongsToMany(models.Permission, {through: 'permission_role'})
      }
    },
    underscored: true,
    tableName: 'roles'
  })

  return Role
}

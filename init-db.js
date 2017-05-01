const env = process.env.NODE_ENV || 'development'
const src = env === 'production' ? './build/models' : './src/models'
const db = require(src).default
const models = db
const faker = require('faker')

async function init () {
  // 新建表
  await db.sequelize.sync()
  console.log('db init over!')

  // 新增角色，并绑定权限
  let role1 = await models.Role.create({
    name: 'admin',
    display_name: 'User Administrator',
    description: 'User is allowed to manage and edit other users'
  })
  let permission1 = await models.Permission.create({
    name: 'edit-users',
    display_name: 'Edit Users',
    description: 'edit existing users'
  })
  let role2 = await models.Role.create({
    name: 'normal:30qps',
    display_name: '30 QPS Normal User',
    description: 'User is allowed to view and edit the content, his ratelimit is 30qps'
  })
  let role3 = await models.Role.create({
    name: 'normal:300qpt',
    display_name: '300 QPT Normal User',
    description: 'User is allowed to view and edit the content, his ratelimit is 300qpt'
  })
  let role4 = await models.Role.create({
    name: 'normal:3000qph',
    display_name: '3000 QPH Normal User',
    description: 'User is allowed to view and edit the content, his ratelimit is 3000qph'
  })
  let role5 = await models.Role.create({
    name: 'normal:30000qpd',
    display_name: '30000 QPD Normal User',
    description: 'User is allowed to view and edit the content, his ratelimit is 30000qpd'
  })
  let role6 = await models.Role.create({
    name: 'normal:300000qpw',
    display_name: '300000 QPW Normal User',
    description: 'User is allowed to view and edit the content, his ratelimit is 300000qpw'
  })
  let role7 = await models.Role.create({
    name: 'normal:3000000qpm',
    display_name: '3000000 QPM Normal User',
    description: 'User is allowed to view and edit the content, his ratelimit is 3000000qpm'
  })
  let permission2 = await models.Permission.create({
    name: 'view-edit',
    display_name: 'View Edit',
    description: 'View and edit the content'
  })
  await role1.addPermissions([permission1, permission2])
  for (const role of [role2, role3, role4, role5, role6, role7]) {
    await role.addPermission(permission2)
  }

  // 新增管理用户，并绑定角色
  let user1 = await models.User.create({
    name: 'guoyy2',
    email: '13302331219@189.com',
    password: 'qwe123!Q'
  })
  await user1.addRole(role1)
  let user2 = await models.User.create({
    name: 'test',
    email: '13302330333@189.com',
    password: 'qwe123!Q'
  })
  await user2.addRole(role4)

  // 新增Fake测试数据
  let roles = await models.Role.findAll()
  for (var i = 0, len = 40; i < len; i++) {
    let tmpUser = await models.User.create({
      name: faker.name.firstName().toLowerCase(),
      email: faker.internet.email(),
      password: faker.lorem.words()
    })
    let tmpRole = roles[Math.floor(Math.random() * roles.length)]
    await tmpUser.addRole(tmpRole)
  }
}

init()

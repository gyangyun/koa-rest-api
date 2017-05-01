import jwt from 'jsonwebtoken'
import oauth2orize from 'oauth2orize-koa'
import compose from 'koa-compose'
import models from '../../models'
import config from 'config'
import logger from '../../utils/logger'

const secretOrKey = config.get('Customer.secretOrKey')
const log = logger(module)

/**
 * Creates jwt token and refresh token
 *
 * @param {Object} user - The user object
 * @param {String} user._id - The user id
 * @param {String} user.username - The username (email)
 * @param {Object} client - The client object
 * @param {String} client._id - The client id
 */
async function generateTokens (user) {
  delete user.dataValues.password
  user = user.toJSON()
  for (const role of user.Roles) {
    if (role.name === 'admin') {
      user.isAdmin = true
      user.max = 999999
      user.duration = 60 * 60 * 1000
      break
    } else {
      if (role.name.startsWith('normal')) {
        let [max, duration] = role.name.replace('normal:', '').split('qp')
        switch (duration) {
          case 's':
            duration = 6 * 1000
            break
          case 't':
            duration = 60 * 1000
            break
          case 'h':
            duration = 60 * 60 * 1000
            break
          case 'd':
            duration = 24 * 60 * 60 * 1000
            break
          case 'w':
            duration = 7 * 24 * 60 * 60 * 1000
            break
          case 'm':
            duration = 30 * 24 * 60 * 60 * 1000
            break
          default:
            duration = 60 * 1000
        }
        [user.max, user.duration] = [Number(max), duration]
      }
      break
    }
  }
  const jwtToken = jwt.sign({
    user
  }, secretOrKey)

  return jwtToken
}

// Create the server
const server = oauth2orize.createServer()

// Setup the server to exchange a password for a token
server.exchange(oauth2orize.exchange.password(async (client, username, password, scope) => {
  try {
    // Find the user in the database with the requested username or email
    const user = await models.User.findOne({
      include: [
        {
          model: models.Role,
          attributes: ['id', 'name', 'display_name', 'description'],
          include: [
            {
              model: models.Permission,
              attributes: ['id', 'name', 'display_name', 'description']
            }
          ]
        }
      ],
      where: {
        name: username.toLowerCase()
      }
    })
    if (!user) return false
    // If there is a match and the passwords are equal
    const isMatch = await user.authenticate(password)
    if (!isMatch) return false
    return await generateTokens(user)
  } catch (e) {
    // Signal that there was an error processing the request
    log.error(e)
    return false
  }
}))

/**
 *`token` middleware handles client requests to exchange authorization grants
 * for jwt tokens.  Based on the grant type being exchanged, the above
 * exchange middleware will be invoked to handle the request.  Clients must
 * authenticate when making requests to this endpoint.
 * @returns {Object} The token middleware
 */

export function token () {
  return compose([
    server.token(),
    server.errorHandler()
  ])
}

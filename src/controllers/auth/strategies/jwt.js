import models from '../../../models'
import passportJwt from 'passport-jwt'
import config from 'config'
const secretOrKey = config.get('Customer.secretOrKey')

const JwtStrategy = passportJwt.Strategy
const ExtractJwt = passportJwt.ExtractJwt
const User = models.User

var opts = {}
opts.jwtFromRequest = ExtractJwt.fromAuthHeaderWithScheme('Bearer')
opts.secretOrKey = secretOrKey
// opts.issuer = 'accounts.examplesoft.com'
// opts.audience = 'yoursite.net'
export default new JwtStrategy(opts, async (jwt_payload, done) => {
  try {
    // let user = await User.findById(jwt_payload.user.id)
    let user = jwt_payload.user
    if (!user) {
      return done(null, false)
    }
    return done(null, user, { scope: '*' })
  } catch (error) {
    return done(error)
  }
})

import passport from 'koa-passport'
import compose from 'koa-compose'
import importDir from 'import-dir'
import models from '../../models'

const User = models.User
const strategies = importDir('./strategies')

Object.keys(strategies).forEach(name => {
  passport.use(name, strategies[name])
})

passport.serializeUser((user, done) => done(null, user.id))

passport.deserializeUser((id, done) => {
  (async () => {
    try {
      const user = await User.findById(id)
      done(null, user)
    } catch (error) {
      done(error)
    }
  })()
})

export default function auth () {
  return compose([
    passport.initialize(),
    passport.session()
  ])
}

export function isJwtAuthenticated () {
  return passport.authenticate('jwt', { session: false })
}

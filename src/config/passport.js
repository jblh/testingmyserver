require('dotenv').config()
const passport = require('passport')
const { Strategy: JwtStrategy, ExtractJwt } = require('passport-jwt')
const User = require('../api/user/User.model')
const SECRET_KEY = process.env.SECRET_KEY

const opts = {}
opts.jwtFromRequest = ExtractJwt.fromAuthHeaderAsBearerToken()
opts.secretOrKey = SECRET_KEY

passport.use(
  new JwtStrategy(opts, async (payload, done) => {
    console.log('passport from passport.js')
    try {
      const user = await User.getById(payload.id)

      if (!user) {
        return done(new Error('User not found'))
      }
      if (!user.token) {
        return done(null, false)
      }
      return done(null, user)
    } catch (err) {
      return done(err, false)
    }
  }),
)

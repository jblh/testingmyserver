const passport = require('passport')
const HttpCodes = require('../constants/httpCodes')
require('../config/passport')

const guard = (req, res, next) => {
  passport.authenticate('jwt', { session: false }, (err, user) => {
    const headerAuth = req.get('Authorization')

    let token = null
    if (headerAuth) {
      token = headerAuth.split(' ')[1]
    }

    if (err || !user || token !== user.token) {
      return res.status(HttpCodes.UNAUTHORIZED).json({
        status: 'error',
        code: HttpCodes.UNAUTHORIZED,
        message: 'Invalid credentials',
      })
    }
    req.user = user
    return next()
  })(req, res, next)
}

module.exports = guard

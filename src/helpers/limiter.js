const HttpCodes = require('../constants/httpCodes')

const limiterAPI = {
  windowMs: 15 * 60 * 1000, // 15 minutes
  max: 1000, // 1000 requests max in 15 min
  handler: (_req, res, _next) => {
    return res.status(HttpCodes.TOO_MANY_REQUESTS).json({
      status: 'error',
      code: HttpCodes.TOO_MANY_REQUESTS,
      message: 'Too Many Requests',
    })
  },
}

module.exports = limiterAPI

const HttpCodes = require('../../constants/httpCodes')
const Users = require('./User.model')
const RootController = require('../rootClasses/RootController')
const jwt = require('jsonwebtoken')
require('dotenv').config()
const SECRET_KEY = process.env.SECRET_KEY

class UsersController extends RootController {
  async create(req, res, next) {
    const { resBuilder } = res

    try {
      const user = await Users.findByLogin(req.body.login)

      if (user) {
        return resBuilder.error({
          code: HttpCodes.CONFLICT,
          message: 'Login is already used',
        })
      }

      const { id, login } = await Users.createItem(req.body)
      return resBuilder.successCreated({
        code: HttpCodes.CREATED,
        data: { id, login },
      })
    } catch (e) {
      next(e)
    }
  }

  async login(req, res, next) {
    const { resBuilder } = res

    try {
      const user = await Users.findByLogin(req.body.login)
      const isValidPassword = await user.isValidPassword(req.body.password)

      if (!user || !isValidPassword) {
        return resBuilder.error({
          code: HttpCodes.UNAUTHORIZED,
          message: 'Invalid credentials',
        })
      }

      const id = user.id
      const payload = { id }
      const token = jwt.sign(payload, SECRET_KEY, { expiresIn: '2h' })
      await Users.updateToken(id, token)

      return resBuilder.success({
        code: HttpCodes.OK,
        data: { token },
      })
    } catch (e) {
      next(e)
    }
  }

  async logout(req, res, next) {
    const { resBuilder } = res

    try {
      const id = req.user.id
      await Users.updateToken(id, null)

      return resBuilder.success({ code: HttpCodes.NO_CONTENT })
    } catch (e) {
      next(e)
    }
  }
}

module.exports = new UsersController({
  methodsName: Users,
  controllerName: 'User',
})

const HttpCodes = require('../constants/httpCodes')

class CustomResBuilder {
  constructor(res) {
    this.res = res
  }

  error(args) {
    const { code = HttpCodes.SERVER_ERROR, message = 'something went wrong' } =
      args

    return this.res.status(code).json({
      status: 'error',
      code,
      message,
    })
  }

  success(args) {
    const { code = HttpCodes.OK, message = 'ok', data } = args

    return this.res.status(code).json({
      status: 'success',
      code,
      message,
      data,
    })
  }

  successGetById(args) {
    const { code = HttpCodes.OK, message = 'found', data } = args

    return this.res.status(code).json({
      status: 'success',
      code,
      message,
      data: {
        foundItem: data,
      },
    })
  }

  successCreated(args) {
    const { code = HttpCodes.OK, message = 'created', data } = args

    return this.res.status(code).json({
      status: 'success',
      code,
      message,
      data: {
        created: data,
      },
    })
  }

  successUpdated(args) {
    const { code = HttpCodes.OK, message = 'updated', data } = args

    return this.res.status(code).json({
      status: 'success',
      code,
      message,
      data: {
        updated: data,
      },
    })
  }

  successDeleted(args) {
    const { code = HttpCodes.OK, message = 'deleted', data } = args

    return this.res.status(code).json({
      status: 'success',
      code,
      message,
      data: {
        deleted: data,
      },
    })
  }
}

module.exports = (_req, res, next) => {
  res.resBuilder = new CustomResBuilder(res)
  next()
}

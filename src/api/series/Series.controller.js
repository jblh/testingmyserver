const RootController = require('../rootClasses/RootController')
const Series = require('./Series.model')
const Cards = require('../card/Card.model')
const Editions = require('../edition/Edition.model')
const CloudUploadService = require('../../services/CloudUploadService')
const fs = require('fs').promises
const HttpCodes = require('../../constants/httpCodes')

class SeriesController extends RootController {
  create = async (req, res, next) => {
    const { body = null } = req
    const { resBuilder } = res

    try {
      if (req.file) {
        const uploads = new CloudUploadService()
        const { idCloudLogo, urlLogo } = await uploads.saveSeriesLogo(
          req.file.path,
        )
        body.urlLogo = urlLogo
        body.idCloudLogo = idCloudLogo
        await fs.unlink(req.file.path)
      }

      const newItem = await this.methodsName.createItem(body)

      if (!newItem) {
        return resBuilder.error({
          code: HttpCodes.SERVER_ERROR,
          message: `[${this.controllerName}] was not created!`,
        })
      }

      return resBuilder.successCreated({
        code: HttpCodes.OK,
        message: `New [${this.controllerName}] was created`,
        data: newItem,
      })
    } catch (e) {
      next(e)
    }
  }

  update = async (req, res, next) => {
    const {
      body = null,
      params: { seriesId = null },
    } = req
    const { resBuilder } = res

    try {
      if (!req.file && !body.seriesName && !body.totalCardsNumber) {
        return resBuilder.error({
          code: HttpCodes.BAD_REQUEST,
          message: 'At least one field is required',
        })
      }

      const uploads = new CloudUploadService()

      if (req.file) {
        const { idCloudLogo, urlLogo } = await uploads.saveSeriesLogo(
          req.file.path,
        )
        body.urlLogo = urlLogo
        body.idCloudLogo = idCloudLogo
        await fs.unlink(req.file.path)
      }

      const series = await this.methodsName.getById(seriesId)
      if (series.idCloudLogo) {
        await uploads.deleteOldAvatar(series.idCloudLogo)
      }

      const updatedItem = await this.methodsName.updateItem(seriesId, body)

      if (!updatedItem) {
        return resBuilder.error({
          code: HttpCodes.SERVER_ERROR,
          message: `[${this.controllerName}] with [${seriesId}] id was not updated or not found!`,
        })
      }

      return resBuilder.successUpdated({
        code: HttpCodes.OK,
        message: `[${this.controllerName}] with [${seriesId}] id was updated`,
        data: updatedItem,
      })
    } catch (e) {
      next(e)
    }
  }

  getById = async (req, res, next) => {
    const { seriesId = null } = req.params
    const { resBuilder } = res

    try {
      const foundItemById = await this.methodsName.getById(seriesId)

      if (!foundItemById) {
        return resBuilder.error({
          code: HttpCodes.NOT_FOUND,
          message: `[${this.controllerName}] with [${seriesId}] id was not found!`,
        })
      }

      return resBuilder.successGetById({
        code: HttpCodes.OK,
        data: foundItemById,
      })
    } catch (e) {
      next(e)
    }
  }

  remove = async (req, res, next) => {
    const { seriesId = null } = req.params
    const { resBuilder } = res

    try {
      const removedItem = await this.methodsName.removeItem(seriesId)
      if (!removedItem) {
        return resBuilder.error({
          code: HttpCodes.SERVER_ERROR,
          message: `[${this.controllerName}] with [${seriesId}] id was not deleted or not found!`,
        })
      }
      await Editions.deleteAll(seriesId)
      await Cards.deleteAll(seriesId)

      return resBuilder.successDeleted({
        code: HttpCodes.OK,
        message: `[${this.controllerName}] with [${seriesId}] id was deleted`,
        data: removedItem,
      })
    } catch (e) {
      next(e)
    }
  }
}

module.exports = new SeriesController({
  methodsName: Series,
  controllerName: 'Series',
})

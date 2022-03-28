const RootController = require('../rootClasses/RootController')
const Series = require('../series/Series.model')
const Editions = require('./Edition.model')
const Cards = require('../card/Card.model')
const HttpCodes = require('../../constants/httpCodes')

class EditionsController extends RootController {
  get = async (req, res, next) => {
    const {
      params: { seriesId = null },
    } = req
    const { resBuilder } = res

    try {
      const collection = await this.methodsName.getCollection(seriesId)

      if (!collection.length) {
        return resBuilder.error({
          code: HttpCodes.NOT_FOUND,
          message: `[${this.controllerName}] list is empty or server error!`,
        })
      }

      return resBuilder.success({
        code: HttpCodes.OK,
        data: collection,
      })
    } catch (e) {
      next(e)
    }
  }

  create = async (req, res, next) => {
    const {
      body = null,
      params: { seriesId = null },
    } = req
    const { resBuilder } = res
    body.series = seriesId

    try {
      const series = await Series.getById(seriesId)
      const newItem = await this.methodsName.createItem(body)

      if (series && newItem) {
        await Series.updateItem(seriesId, { $push: { editions: newItem._id } })
      }

      if (!newItem || !series) {
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

  getById = async (req, res, next) => {
    const { editionId = null } = req.params
    const { resBuilder } = res

    try {
      const foundItemById = await this.methodsName.getById(editionId)

      if (!foundItemById) {
        return resBuilder.error({
          code: HttpCodes.NOT_FOUND,
          message: `[${this.controllerName}] with [${editionId}] id was not found!`,
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
    const { editionId = null } = req.params
    const { resBuilder } = res

    try {
      const removedItem = await this.methodsName.removeItem(editionId)

      if (!removedItem) {
        return resBuilder.error({
          code: HttpCodes.SERVER_ERROR,
          message: `[${this.controllerName}] with [${editionId}] id was not deleted or not found!`,
        })
      }

      const editionCards = await Cards.getCollection(editionId)
      const idCards = editionCards.map(card => card._id)

      await Series.updateItem(
        removedItem.series,
        {
          $pull: {
            editions: removedItem._id,
            cards: { $in: idCards },
          },
        },
        { multi: true },
      )

      await Cards.deleteMany(idCards)

      return resBuilder.successDeleted({
        code: HttpCodes.OK,
        message: `[${this.controllerName}] with [${editionId}] id was deleted`,
        data: removedItem,
      })
    } catch (e) {
      next(e)
    }
  }
}

module.exports = new EditionsController({
  methodsName: Editions,
  controllerName: 'Edition',
})

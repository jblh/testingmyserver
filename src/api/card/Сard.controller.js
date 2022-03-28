const RootController = require('../rootClasses/RootController')
const Cards = require('./Card.model')
const Series = require('../series/Series.model')
const Editions = require('../edition/Edition.model')
const HttpCodes = require('../../constants/httpCodes')
const fs = require('fs').promises
const CloudUploadService = require('../../services/CloudUploadService')
require('dotenv').config()

class CardsController extends RootController {
  get = async (req, res, next) => {
    const {
      params: { editionId = null },
    } = req
    const { resBuilder } = res

    try {
      const collection = await this.methodsName.getCollection(editionId)

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

  getAllCategories = async (_req, res, next) => {
    const { resBuilder } = res

    try {
      const allCards = await this.methodsName.getAllCardsCollection()

      const allCategories = allCards.map(card => card.categories).flat()
      const calcCategories = {}

      if (allCategories.length === 0) {
        return resBuilder.error({
          code: HttpCodes.NOT_FOUND,
          message: `[${this.controllerName}] categories list is empty or server error!`,
        })
      }

      allCategories.forEach(category => {
        if (calcCategories[category] === undefined) {
          calcCategories[category] = allCategories.filter(
            word => word === category,
          ).length
          const procent = (
            (calcCategories[category] / allCards.length) *
            100
          ).toFixed(2)
          calcCategories[category] = procent + '%'
        }
      })

      return resBuilder.success({
        code: HttpCodes.OK,
        data: calcCategories,
      })
    } catch (e) {
      next(e)
    }
  }

  create = async (req, res, next) => {
    const {
      body = null,
      params: { editionId = null },
    } = req
    const { resBuilder } = res

    try {
      const edition = await Editions.getById(editionId)
      body.edition = editionId
      body.series = edition.series

      if (req.file) {
        const uploads = new CloudUploadService()
        const { idCloudJpg, imgUrl } = await uploads.saveImg(req.file.path)
        body.uploadCardThumbnailJpg = imgUrl
        body.idCloudJpg = idCloudJpg
        await fs.unlink(req.file.path)
      }

      const newItem = await this.methodsName.createItem(body)

      if (edition && newItem) {
        await Editions.updateItem(editionId, { $push: { cards: newItem._id } })
        await Series.updateItem(edition.series, {
          $push: { cards: newItem._id },
        })
      }

      if (!newItem || !edition) {
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
      params: { id = null },
    } = req
    const { resBuilder } = res

    try {
      const uploads = new CloudUploadService()

      if (req.file) {
        const { idCloudJpg, imgUrl } = await uploads.saveImg(req.file.path)
        body.uploadCardThumbnailJpg = imgUrl
        body.idCloudJpg = idCloudJpg
        await fs.unlink(req.file.path)
      }

      const card = await this.methodsName.getById(id)

      if (card.idCloudJpg) {
        await uploads.deleteOldAvatar(card.idCloudJpg)
      }

      const updatedItem = await this.methodsName.updateItem(id, body)

      if (!updatedItem) {
        await fs.unlink(req.file.path)
        return resBuilder.error({
          code: HttpCodes.BAD_REQUEST,
          message: `[${this.controllerName}] with [${id}] id was not updated or not found!`,
        })
      }

      return resBuilder.successUpdated({
        code: HttpCodes.OK,
        message: `[${this.controllerName}] with [${id}] id was updated`,
        data: updatedItem,
      })
    } catch (e) {
      next(e)
    }
  }

  uploadPng = async (req, res, next) => {
    const { id } = req.params
    const { resBuilder } = res

    try {
      const card = await Cards.getById(id)

      const uploads = new CloudUploadService()
      const { idCloudJpg, imgUrl } = await uploads.saveImg(req.file.path)

      if (card.idCloudJpg) {
        await uploads.deleteOldAvatar(card.idCloudJpg)
      }

      await fs.unlink(req.file.path)
      await Cards.updatePng(id, imgUrl, idCloudJpg)
      return resBuilder.successCreated({
        code: HttpCodes.OK,
        message: 'The new Image card uploaded',
        data: imgUrl,
      })
    } catch (e) {
      next(e)
    }
  }

  uploadWebm = async (req, res, next) => {
    const { id } = req.params
    const { resBuilder } = res

    try {
      const card = await this.methodsName.getById(id)

      if (!card.goldenCard) {
        await fs.unlink(req.file.path)
        return resBuilder.error({
          code: HttpCodes.SERVER_ERROR,
          message: `The status of the card ${card.cardName} should be golden for upload video`,
        })
      }

      const uploads = new CloudUploadService()
      const { idCloudWebm, webmUrl } = await uploads.saveWebm(req.file.path)

      if (card.idCloudWebm) {
        await uploads.deleteOldAvatar(card.idCloudWebm)
      }

      await fs.unlink(req.file.path)
      await Cards.updateWebm(id, webmUrl, idCloudWebm)
      return resBuilder.successCreated({
        code: HttpCodes.OK,
        message: 'The new card Webm uploaded',
        data: webmUrl,
      })
    } catch (e) {
      next(e)
    }
  }

  remove = async (req, res, next) => {
    const { id = null } = req.params
    const { resBuilder } = res

    try {
      const removedItem = await this.methodsName.removeItem(id)

      if (!removedItem) {
        return resBuilder.error({
          code: HttpCodes.SERVER_ERROR,
          message: `[${this.controllerName}] with [${id}] id was not deleted or not found!`,
        })
      }

      await Editions.updateItem(removedItem.edition, {
        $pull: { cards: removedItem._id },
      })
      await Series.updateItem(removedItem.series, {
        $pull: { cards: removedItem._id },
      })

      return resBuilder.successDeleted({
        code: HttpCodes.OK,
        message: `[${this.controllerName}] with [${id}] id was deleted`,
        data: removedItem,
      })
    } catch (e) {
      next(e)
    }
  }
}

module.exports = new CardsController({
  methodsName: Cards,
  controllerName: 'Card',
})

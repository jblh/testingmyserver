const RootModel = require('../rootClasses/RootModel')
const CardSchema = require('./Card.schema')

class CardModel extends RootModel {
  getCollection(editionId) {
    return this.modelName.find({ edition: editionId })
  }

  getAllCardsCollection() {
    return this.modelName.find({})
  }

  updatePng(id, imgUrl, idCloudJpg = null) {
    return CardSchema.findOneAndUpdate(
      { _id: id },
      { uploadCardThumbnailJpg: imgUrl, idCloudJpg },
      { new: true },
    )
  }

  updateWebm(id, webmUrl, idCloudWebm = null) {
    return CardSchema.findOneAndUpdate(
      { _id: id },
      { uploadCardHighResWebm: webmUrl, idCloudWebm },
      { new: true },
    )
  }

  deleteMany(arrayOfObjToDelete) {
    return this.modelName.deleteMany({
      _id: { $in: arrayOfObjToDelete },
    })
  }
}

module.exports = new CardModel(CardSchema)

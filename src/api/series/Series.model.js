const RootModel = require('../rootClasses/RootModel')
const SeriesSchema = require('./Series.schema')
const EditionSchema = require('../edition/Edition.schema')
const CardSchema = require('../card/Card.schema')

class SeriesModel extends RootModel {
  getCollection() {
    return this.modelName.find({}).populate({
      path: 'editions',
      model: EditionSchema,
      populate: [{ path: 'cards', model: CardSchema }],
    })
  }
}

module.exports = new SeriesModel(SeriesSchema)

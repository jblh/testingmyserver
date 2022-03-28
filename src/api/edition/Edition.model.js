const RootModel = require('../rootClasses/RootModel')
const EditionSchema = require('./Edition.schema')

class EditionModel extends RootModel {
  getCollection(seriesId) {
    return this.modelName.find({ series: seriesId })
  }
}

module.exports = new EditionModel(EditionSchema)

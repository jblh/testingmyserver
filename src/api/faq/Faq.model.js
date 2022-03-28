const RootModel = require('../rootClasses/RootModel')
const FaqSchema = require('./Faq.schema')

class FaqModel extends RootModel {}

module.exports = new FaqModel(FaqSchema)

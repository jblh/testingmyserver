const RootController = require('../rootClasses/RootController')
const Faq = require('./Faq.model')

class FaqController extends RootController {}

module.exports = new FaqController({
  methodsName: Faq,
  controllerName: 'Faq',
})

const express = require('express')
const router = express.Router()
const EditionsController = require('./Edition.controller')

router
  .get('/editions/:seriesId', EditionsController.get)
  .post('/editions/:seriesId', EditionsController.create)

router
  .get('/edition/:editionId', EditionsController.getById)
  .delete('/edition/:editionId', EditionsController.remove)

module.exports = router

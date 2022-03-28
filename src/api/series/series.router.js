const express = require('express')
const router = express.Router()
const SeriesController = require('./Series.controller')
const guard = require('../../helpers/guard')
const upload = require('../../helpers/upload')

router
  // For the main client:
  .get('/series_', SeriesController.get)
  // For the admin client:
  .get('/series', guard, SeriesController.get)
  .post('/series', upload.single('file'), guard, SeriesController.create)

router
  .put(
    '/series/:seriesId',
    upload.single('file'),
    guard,
    SeriesController.update,
  )
  .get('/series/:seriesId', guard, SeriesController.getById)
  .get('/series_/:seriesId', SeriesController.getById)
  .delete('/series/:seriesId', guard, SeriesController.remove)

module.exports = router

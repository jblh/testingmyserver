const express = require('express')
const router = express.Router()
const {
  validationCreatedCard,
  validationUpdatedCard,
} = require('../../validation/cards')
const CardsController = require('./Сard.controller')
const upload = require('../../helpers/upload')
const guard = require('../../helpers/guard')

router.get('/cards-categories', CardsController.getAllCategories)

router
  .get('/cards/:editionId', CardsController.get)
  .post(
    '/cards/:editionId',
    upload.single('file'),
    guard,
    validationCreatedCard,
    CardsController.create,
  )

router
  .get('/card/:id', CardsController.getById)
  .put(
    '/card/:id',
    upload.single('file'),
    validationUpdatedCard,
    guard,
    CardsController.update,
  )
  .delete('/card/:id', guard, CardsController.remove)
  .patch(
    '/card/png/:id',
    upload.single('file'),
    guard,
    CardsController.uploadPng,
  )
  .patch(
    '/card/webm/:id',
    upload.single('fileWebm'),
    guard,
    CardsController.uploadWebm,
  )

module.exports = router

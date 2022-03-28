const express = require('express')
const router = express.Router()
const FaqController = require('./Faq.controller')
const guard = require('../../helpers/guard')

router.get('/faq', FaqController.get)

module.exports = router

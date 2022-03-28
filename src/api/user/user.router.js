const express = require('express')
const router = express.Router()
const UsersController = require('./User.controller')
const guard = require('../../helpers/guard')

router.post('/create', UsersController.create)
router.post('/login', UsersController.login)
router.post('/logout', guard, UsersController.logout)

module.exports = router

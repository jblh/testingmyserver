const express = require('express')
const logger = require('morgan')
const cors = require('cors')
const helmet = require('helmet')
const rateLimit = require('express-rate-limit')
const implantResBuilder = require('../helpers/CustomResBuilder')
const HttpCodes = require('../constants/httpCodes')
const seriesRoute = require('../api/series/series.router')
const cardsRoute = require('../api/card/card.router')
const editionsRoute = require('../api/edition/edition.router')
const faqRoute = require('../api/faq/faq.router')
const userRoute = require('../api/user/user.router')
const guard = require('../helpers/guard')
const limiterAPI = require('../helpers/limiter')
const swaggerUi = require('swagger-ui-express')
const swaggerDocument = require('../../swagger.json')

const app = express()

const formatsLogger = app.get('env') === 'development' ? 'dev' : 'short'
app.use(helmet())
app.use(logger(formatsLogger))
app.use(cors())
app.use(express.json({ limit: 10000 })) // the limit is set in opposition DDoS attacks
app.use('/', rateLimit(limiterAPI))
app.use('/api-docs', swaggerUi.serve, swaggerUi.setup(swaggerDocument))
app.use(implantResBuilder)
app.use('/', userRoute)
app.use('/', seriesRoute)
app.use('/', faqRoute)
app.use('/', cardsRoute)
app.use('/', guard, editionsRoute)
// app.use('/', guard, cardsRoute)

// testing

app.use(express.static(path.join(__dirname, 'build')))

app.get('/*', function (req, res) {
  res.sendFile(path.join(__dirname, 'build', 'index.html'))
})

// testing

app.use((_req, res) => {
  res.status(HttpCodes.NOT_FOUND).json({ message: 'Not found' })
})

app.use((err, _req, res, _next) => {
  res.status(err.status || HttpCodes.SERVER_ERROR).json({
    message: err.message || 'unknown error',
    status: err.status || HttpCodes.SERVER_ERROR,
  })
})

process.on('unhandledRejection', (reason, promise) => {
  console.log('Unhandled Rejection at:', promise, 'reason:', reason)
  // Application specific logging, throwing an error, or other logic here
})

module.exports = app

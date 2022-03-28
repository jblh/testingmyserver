require('dotenv').config()
const app = require('./app')
const db = require('../api/dbConnection')
const createFolderIsNotExist = require('../helpers/createFolder')

const PORT = process.env.PORT || 3000
const UPLOAD_DIR = process.env.UPLOAD_DIR

// testing

app.use(express.static(path.join(__dirname, 'build')))

app.get('/*', function (req, res) {
  res.sendFile(path.join(__dirname, 'build', 'index.html'))
})

// testing

db.then(() => {
  app.listen(PORT, async () => {
    await createFolderIsNotExist(UPLOAD_DIR)
    console.log(`Database connection successful. API work on port: ${PORT}...`)
  })
}).catch(error => {
  console.error(`Server starting error: '${error.message}'`)
  process.exit(1)
})

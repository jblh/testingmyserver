require('dotenv').config()
const app = require('./app')
const db = require('../api/dbConnection')
const createFolderIsNotExist = require('../helpers/createFolder')

const PORT = process.env.PORT || 3000
const UPLOAD_DIR = process.env.UPLOAD_DIR

db.then(() => {
  app.listen(PORT, async () => {
    await createFolderIsNotExist(UPLOAD_DIR)
    console.log(`Database connection successful. API work on port: ${PORT}...`)
  })
}).catch(error => {
  console.error(`Server starting error: '${error.message}'`)
  process.exit(1)
})

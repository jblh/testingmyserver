const { Schema, model } = require('mongoose')
const { optionsForSchemas } = require('../../constants/options')

const seriesSchema = new Schema(
  {
    seriesName: {
      type: String,
      required: [true, 'series name is required'],
      unique: true,
    },
    totalCardsNumber: {
      type: Number,
      required: true,
    },
    urlLogo: {
      type: String,
    },
    idCloudLogo: {
      type: String,
    },
    editions: [
      {
        type: Schema.Types.ObjectId,
        ref: 'editions',
      },
    ],
    cards: [
      {
        type: Schema.Types.ObjectId,
        ref: 'cards',
      },
    ],
  },

  {
    ...optionsForSchemas,
  },
)

module.exports = model('series', seriesSchema)

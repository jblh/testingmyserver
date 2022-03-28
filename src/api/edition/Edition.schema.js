const { Schema, model } = require('mongoose')
const { optionsForSchemas } = require('../../constants/options')

const editionSchema = new Schema(
  {
    editionName: {
      type: String,
      required: [true, 'editionName is required'],
    },
    series: {
      type: Schema.Types.ObjectId,
      ref: 'series',
    },
    cards: [{ type: Schema.Types.ObjectId, ref: 'cards' }],
  },

  {
    ...optionsForSchemas,
  },
)

module.exports = model('editions', editionSchema, 'editions')

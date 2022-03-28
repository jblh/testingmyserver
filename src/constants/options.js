module.exports = {
  optionsForSchemas: {
    versionKey: false,
    timestamps: true,
    toJSON: {
      virtuals: true,
      transform: function (_doc, ret) {
        delete ret._id
        return ret
      },
    },
    toObject: {
      virtuals: true,
      transform: function (_doc, ret) {
        delete ret._id
        return ret
      },
    },
  },
}

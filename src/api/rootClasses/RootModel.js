module.exports = class BaseMethods {
  modelName
  constructor(modelName) {
    this.modelName = modelName
  }

  getCollection() {
    return this.modelName.find({})
  }

  getById(id) {
    return this.modelName.findOne({ _id: id })
  }

  createItem(body) {
    return this.modelName.create(body)
  }

  updateItem(id, body) {
    return this.modelName.findOneAndUpdate(
      { _id: id },
      { ...body },
      { new: true },
    )
  }

  removeItem(id) {
    return this.modelName.findOneAndRemove({ _id: id })
  }

  deleteAll(id) {
    return this.modelName.deleteMany({
      series: id,
    })
  }
}

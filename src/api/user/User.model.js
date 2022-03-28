const RootModel = require('../rootClasses/RootModel')
const UserSchema = require('./User.schema')

class UsersMethods extends RootModel {
  findByLogin(login) {
    return this.modelName.findOne({ login })
  }

  updateToken(id, token) {
    return this.modelName.updateOne({ _id: id }, { token })
  }
}

module.exports = new UsersMethods(UserSchema)

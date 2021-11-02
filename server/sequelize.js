const sequelize = require('./db.js')
const user = require('./models/user')
const note = require('./models/note')

const models = {
  User: user.User,
  Note: note.Note
}

const initRelationsModels = [

  user.initRelations,
  note.initRelations
]

initRelationsModels.forEach(initRelations => initRelations())

module.exports = {
  ...sequelize,
  ...models
}

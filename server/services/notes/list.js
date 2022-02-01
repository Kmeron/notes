const { sequelize } = require('../../db.js')
const { Note } = require('../../models/note.js')
const ServiceError = require('../../ServiceError')
const Joi = require('joi')
const dumpNote = require('./dump')

async function getNotes (params = {}) {
  const transaction = await sequelize.transaction()

  try {
    const { rows, count } = await Note.findAndCountAll({ ...parseQuery(params), transaction })
    const data = rows.map(element => dumpNote(element.dataValues))
    const meta = { limit: params.limit, offset: params.offset, totalCount: count }
    await transaction.commit()
    return { data, meta }
  } catch (error) {
    await transaction.rollback()
    if (['ER_PARSE_ERROR', 'ER_SP_UNDECLARED_VAR'].includes(error.code)) {
      throw new ServiceError({
        message: 'Provided invalid data for getting note',
        code: 'INVALID_DATA'
      })
    }
    throw error
  }
}

function parseQuery (params) {
  const query = {
    where: [
      { userId: params.userId }
    ],
    order: [['id', 'DESC']],
    limit: params.limit,
    offset: params.offset
  }

  if (params.search) {
    query.where.push(sequelize.literal(`MATCH (title,text) AGAINST ('(${params.search}*) ("${params.search}")' IN BOOLEAN MODE)`)) // Sql injection
  }
  return query
}

const validationRules = {
  userId: Joi.number()
    .integer()
    .positive()
    .required(),

  limit: Joi.number()
    .integer()
    .positive()
    .required(),

  offset: Joi.number()
    .integer()
    .min(0)
    .required(),

  search: Joi.string()
}

module.exports = { service: getNotes, validationRules }

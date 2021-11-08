const { sequelize } = require('../../db.js')
const { Note } = require('../../models/note.js')
const ServiceError = require('../../ServiceError')
const Joi = require('joi')
const dumpNote = require('./dump')
// const { Op } = require('sequelize')

function getNotes (params = {}) {
  return sequelize.transaction()
    .then((transaction) => {
      return Note.findAll(chooseArgument(params), { transaction })
        .then(selectResult => {
          return Note.count(chooseArgument(params), { transaction })
            .then(countResult => ({ selectResult, countResult }))
        })
        .then(result => {
          const data = result.selectResult.map(element => dumpNote(element.dataValues))
          const meta = { limit: params.limit, offset: params.offset, totalCount: result.countResult }
          return transaction.commit().then(() => ({ data, meta }))
        })
        .catch(error => {
          return transaction.rollback()
            .then(() => {
              if (['ER_PARSE_ERROR', 'ER_SP_UNDECLARED_VAR'].includes(error.code)) {
                throw new ServiceError({
                  message: 'Provided invalid data for getting note',
                  code: 'INVALID_DATA'
                })
              }
              throw error
            })
        })
    })
}

function chooseArgument (params) {
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

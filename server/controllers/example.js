const Joi = require('joi')

const data = Joi.object({
  username: Joi.string().alphanum().min(3).max(30).required(),
  password: Joi.string().pattern(/^[a-zA-Z0-9]{3,30}$/),
  repeat_password: Joi.ref('password'),
  access_token: [Joi.string(), Joi.number()],
  birth_year: Joi.number().integer().min(1900).max(2013),
  email: Joi.string().email({ minDomainSegments: 2, tlds: { allow: ['com', 'net'] } })
}).with('username', 'birth_year').xor('password', 'access_token').with('password', 'repeat_password').validate({
  username: -1,
  password: 'ww',
  repeat_password: 'aa',
  birth_year: 1994
}, { abortEarly: false })
console.log(data.error.details)
// console.log((data.error.details || []).map(e => e.message))

// const schema = Joi.object({
//   email: Joi.number(),
//   // .email({ minDomainSegments: 2, tlds: { allow: ['com', 'net'] } }),

//   password: Joi.number(),

//   userId: Joi.number()
//     .integer()
//     .positive(),

//   limit: Joi.number()
//     .integer()
//     .positive(),

//   offset: Joi.number()
//     .integer()
//     .min(0)

// })

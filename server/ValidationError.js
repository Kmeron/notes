class ValidationError extends Error {
  constructor ({ message, fields = {}, code, path }) {
    super(message)
    this.code = code
    this.fields = fields
    this.path = path
  }
}
module.exports = ValidationError

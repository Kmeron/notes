// const jwt = localStorage.getItem('jwt')

export default function requestToServer (route, options) {
  options.headers = {
    ...options.headers,
    Authorization: 'eyJ0eXAiOiJKV1QiLCJhbGciOiJIUzI1NiJ9.eyJ1c2VySWQiOjd9.mF228cC-dd8LWZUGcgDd3aIO6yKkN_MMm55FXGWjp_0'
  }
  return fetch('http://localhost:3000/api/v1' + route, options)
    .then(response => response.json())
    .then(body => {
      if (body.ok) {
        return body
      }

      if (body.error.code === 'INVALID_DATA_ERROR') {
        const serviceValidationErrors = ['limit', 'offset']
        const isServiceError = body.error.fields.some(element => serviceValidationErrors.includes(element))
        body.error.message = isServiceError
          ? 'Oops, seems like something has gone bad!'
          : `Oops, you have provided invalid data in such fields: ${body.error.fields.toString()}.`
      }

      throw body.error
    })
}

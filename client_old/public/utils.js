const jwt = localStorage.getItem('jwt')

export function requestToServer(route, options) {
    options.headers = {
        ...options.headers,
        'Authorization' : jwt
    }
    return fetch('/api/v1' + route, options)
        .then(response => response.json())
        .then(body => {
          if (body.ok){
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

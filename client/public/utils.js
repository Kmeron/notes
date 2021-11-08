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
            const serviceErrors = ['limit', 'offset']
            if (body.error.path.some(element => serviceErrors.includes(element))) {
              body.error.message = 'Oops, seems like something has gone bad!'
            }
            throw body.error
        })
}

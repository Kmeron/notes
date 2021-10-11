const jwt = localStorage.getItem('jwt')

export function requestToServer(route, options) {
    options.headers = {
        ...options.headers,
        'Authorization' : jwt
    }
    return fetch(route, options)
        .then(response => response.json())
        .then(body => {
            if (body.ok){
                return body
            } 
            throw body.error
        })
}

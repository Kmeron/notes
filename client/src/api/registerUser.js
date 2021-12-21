import requestToServer from './utils'

export default function registerUser (payload) {
  return requestToServer('/registration', {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify(payload)
  })
}

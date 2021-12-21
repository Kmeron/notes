import requestToServer from './utils'

export default function authorizeUser (payload) {
  return requestToServer('/authorization', {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify(payload)
  })
}

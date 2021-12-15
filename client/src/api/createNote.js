import requestToServer from './utils'

export default function createNote (payload) {
  return requestToServer('/notes', {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify(payload)
  })
}

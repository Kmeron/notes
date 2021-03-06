import requestToServer from './utils'

export default function getNotes (query = {}) {
  if (!query.search) {
    delete query.search
  }
  const params = new URLSearchParams(query).toString()
  return requestToServer('/notes?' + params, {
    method: 'GET',
    headers: { 'Content-Type': 'application/json' }
  })
}

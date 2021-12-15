import requestToServer from './utils'

export default function deleteNote (id) {
  const noteURL = new URLSearchParams({ id: id })
  return requestToServer('/notes?' + noteURL.toString(), {
    method: 'DELETE'
  })
}

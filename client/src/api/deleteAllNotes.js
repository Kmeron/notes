import requestToServer from './utils'

export default function deleteAllNotes () {
  return requestToServer('/notes/delete-all', {
    method: 'DELETE'
  })
}

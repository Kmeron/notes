import requestToServer from "./utils";

export default function saveNote(payload) {

  return requestToServer('/notes', {
    method: 'PUT',
    headers: {
        'Content-Type': 'application/json'},
    body: JSON.stringify(payload)
  })

}
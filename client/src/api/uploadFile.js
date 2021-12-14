import requestToServer from "./utils";

export default function uploadFile(file) {

  return requestToServer('/upload', {
		method: 'POST',
		body: file,
        headers: {'Content-Type': 'text/plain'}
	})
}
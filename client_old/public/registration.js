import {requestToServer} from './utils.js'
const email = document.getElementById('email')
const password = document.getElementById('password')
const signUp = document.getElementById('sign-up')

signUp.onclick = () => {
    const payload = {
        email: email.value,
        password: password.value
    }
    return requestToServer('/registration', {
        method: 'POST',
        headers: {
            'Content-Type': 'application/json'},
        body: JSON.stringify(payload)
    })
    .then(() => {
        alert('Congratulations! You have just registered. Please check your email to verify account!')
        window.location.href = '/authorization'
    })
    .catch(error => {
        alert(error.message)
        email.value = ''
        password.value = ''
    })
}
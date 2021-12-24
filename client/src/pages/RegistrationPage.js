import './RegistrationPage.css'
import RegEmailInput from '../inputs/RegEmailInput'
import RegPasswordInput from '../inputs/RegPasswordInput'
import { useState } from 'react'
import { useNavigate } from 'react-router'
import SignUp from '../buttons/SignUp'
import registerUser from '../api/registerUser'

export default function RegistrationPage () {
  const navigate = useNavigate()

  const [credentials, setCredentials] = useState({ email: '', password: '' })

  const handleOnClickSignOutButton = async (payload) => {
    try {
      await registerUser(payload)
      alert('Congratulations! You have just registered. Please check your email to verify account!')
      navigate('/authorization')
    } catch (error) {
      alert(error.message)
    }
    // registerUser(payload)
    //   .then(() => {
    //     alert('Congratulations! You have just registered. Please check your email to verify account!')
    //     navigate('/authorization')
    //   })
    //   .catch(error => alert(error.message))
  }

  return (
    <div id="reg-block">

      <div id="reg-div">
        <p type="text" id="reg">Registration</p>
      </div>

      <div className="input-line">
        <p type="text">Email:</p>
        <RegEmailInput onChange={current => setCredentials(previous => ({ ...previous, ...current }))}/>
      </div>

      <div className="input-line">
        <p type="text">Password:</p>
        <RegPasswordInput onChange={current => setCredentials(previous => ({ ...previous, ...current }))}/>
      </div>

      <div id="reg-div">
        <SignUp onClick={() => handleOnClickSignOutButton(credentials)}/>
      </div>

    </div>
  )
}

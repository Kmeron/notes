import { useState } from 'react'
import './AuthorizationPage.css'
import AuthEmailInput from '../inputs/AuthEmailInput'
import AuthPasswordInput from '../inputs/AuthPasswordInput'
import SignIn from '../buttons/SignIn'
import SignUp from '../buttons/SignUp'
import authorizeUser from '../api/authorizeUser'

import { useNavigate } from 'react-router-dom'

function AuthorizationPage () {
  const [credentials, setCredentials] = useState({ email: '', password: '' })
  const navigate = useNavigate()

  const handleOnClickSignInButton = async (payload) => {
    try {
      const { data } = await authorizeUser(payload)
      localStorage.setItem('jwt', data.jwt)
      navigate('/')
    } catch (error) {
      alert(error.message)
    }
    // authorizeUser(payload)
    // .then(({ data }) => {
    //   localStorage.setItem('jwt', data.jwt)
    //   navigate('/')
    // })
    // .catch(error => alert(error.message))
  }

  return (
    <div id="auth-block">

      <div id="auth-div">
        <p type="text " id="auth">Authorization</p>
      </div>

      <div className="input-line">
        <p type="text">Email:</p>
        <AuthEmailInput onChange={current => setCredentials(previous => ({ ...previous, ...current }))} />
      </div>

      <div className="input-line">
        <p type="text">Password:</p>
        <AuthPasswordInput onChange={current => setCredentials(previous => ({ ...previous, ...current }))}/>
      </div>

      <SignIn onClick={() => handleOnClickSignInButton(credentials)}/>

      <div id="acc">
        <p type="text">Don`t have an account?</p>
        <SignUp onClick={() => navigate('/registration')} />
      </div>

    </div>
  )
}

export default AuthorizationPage

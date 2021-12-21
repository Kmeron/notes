import PropTypes from 'prop-types'

function AuthEmailInput ({ onChange }) {
  return (

    <input type="text" id="email" onChange={event => onChange({ email: event.target.value })} />

  )
}

AuthEmailInput.propTypes = {
  onChange: PropTypes.func.isRequired
}

export default AuthEmailInput

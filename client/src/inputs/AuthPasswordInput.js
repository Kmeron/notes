import PropTypes from 'prop-types'

function AuthPasswordInput ({ onChange }) {
  return (

    <input type="password" id="password" onChange={event => onChange({ password: event.target.value })} />

  )
}

AuthPasswordInput.propTypes = {
  onChange: PropTypes.func.isRequired
}

export default AuthPasswordInput

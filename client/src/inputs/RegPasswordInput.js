import PropTypes from 'prop-types'

function RegPasswordInput ({ onChange }) {
  return (

    <input type="password" id="password" onChange={event => onChange({ password: event.target.value })} />

  )
}

RegPasswordInput.propTypes = {
  onChange: PropTypes.func.isRequired
}

export default RegPasswordInput

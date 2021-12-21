import PropTypes from 'prop-types'

function RegEmailInput ({ onChange }) {
  return (

    <input type="text" id="email" onChange={event => onChange({ email: event.target.value })} />

  )
}

RegEmailInput.propTypes = {
  onChange: PropTypes.func.isRequired
}

export default RegEmailInput

import PropTypes from 'prop-types'

function EditTextInput ({ value, onChange }) {
  return (
    <input type="text" value={value} onChange={event => onChange({ text: event.target.value })} />
  )
}

EditTextInput.propTypes = {
  value: PropTypes.string.isRequired,
  onChange: PropTypes.func.isRequired
}

export default EditTextInput

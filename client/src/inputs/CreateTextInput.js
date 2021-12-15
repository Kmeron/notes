import PropTypes from 'prop-types'

function CreateTextInput ({ value, onChange }) {
  return (
    <div className="input-line">
      <textarea type="text" id="text" value={value} onChange={event => onChange({ text: event.target.value })} />
    </div>
  )
}

CreateTextInput.propTypes = {
  value: PropTypes.string.isRequired,
  onChange: PropTypes.func.isRequired
}

export default CreateTextInput

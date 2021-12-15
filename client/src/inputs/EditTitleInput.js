import PropTypes from 'prop-types'

function EditTitleInput ({ value, onChange }) {
  return (
    <input type="text" value={value} onChange={event => onChange({ title: event.target.value })} />
  )
}

EditTitleInput.propTypes = {
  value: PropTypes.string.isRequired,
  onChange: PropTypes.func.isRequired
}

export default EditTitleInput

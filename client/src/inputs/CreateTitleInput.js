import PropTypes from 'prop-types'

function CreateTitleInput ({ value, onChange }) {
  return (
    <div className="input-line">
      <input type="text" id="title" value={value} onChange={event => onChange({ title: event.target.value })} />
    </div>
  )
}

CreateTitleInput.propTypes = {
  value: PropTypes.string.isRequired,
  onChange: PropTypes.func.isRequired
}

export default CreateTitleInput

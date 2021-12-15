import PropTypes from 'prop-types'

function FindInput ({ onChange }) {
  return (
    <div className="input-line input-find">
      <input type="text" id="search" onChange={event => onChange(event.target.value)} />
    </div>
  )
}

FindInput.propTypes = {
  onChange: PropTypes.func.isRequired
}

export default FindInput

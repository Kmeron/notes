import PropTypes from 'prop-types'

function Save ({ onClick }) {
  return (
      <button onClick={onClick}>
        Save
      </button>
  )
}

Save.propTypes = {
  onClick: PropTypes.func.isRequired
}

export default Save

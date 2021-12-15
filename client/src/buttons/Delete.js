import PropTypes from 'prop-types'

function Delete ({ onClick }) {
  return (
      <button onClick={onClick}>
        Delete
      </button>
  )
}

Delete.propTypes = {
  onClick: PropTypes.func.isRequired
}

export default Delete

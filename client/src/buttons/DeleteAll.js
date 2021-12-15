import PropTypes from 'prop-types'

function DeleteAll ({ onClick }) {
  return (
      <button onClick={onClick}>
        Delete All
      </button>
  )
}

DeleteAll.propTypes = {
  onClick: PropTypes.func.isRequired
}

export default DeleteAll

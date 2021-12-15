import PropTypes from 'prop-types'

function Create ({ onClick }) {
  return (
      <button onClick={onClick}>
        Create
      </button>
  )
}

Create.propTypes = {
  onClick: PropTypes.func.isRequired
}

export default Create

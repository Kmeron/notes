import PropTypes from 'prop-types'

function Find ({ onClick }) {
  return (
      <button onClick={onClick}>
        Find
      </button>
  )
}

Find.propTypes = {
  onClick: PropTypes.func.isRequired
}

export default Find

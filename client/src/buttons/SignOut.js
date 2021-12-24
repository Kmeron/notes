import PropTypes from 'prop-types'

function SignOut ({ onClick }) {
  return (
    <div>
      <button onClick={onClick}>
        Sign Out
      </button>
    </div>
  )
}

SignOut.propTypes = {
  onClick: PropTypes.func.isRequired
}

export default SignOut

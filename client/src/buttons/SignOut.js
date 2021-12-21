import PropTypes from 'prop-types'

function SignOut ({ onClick }) {
  // function signOut() {
  // TODO /authorization
  // }

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

import PropTypes from 'prop-types'

function SignIn ({ onClick }) {
  return (
    <div id="auth-div">
      <button id="sign-in" onClick={onClick}>
        Sign In
      </button>
    </div>
  )
}

SignIn.propTypes = {
  onClick: PropTypes.func.isRequired
}

export default SignIn

import PropTypes from 'prop-types'

function SignUp ({ onClick }) {
  return (
      <button id="sign-up" onClick={onClick}>
        SignUp
      </button>
  )
}

SignUp.propTypes = {
  onClick: PropTypes.func.isRequired
}

export default SignUp

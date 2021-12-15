import PropTypes from 'prop-types'

function PageButtons ({ limit, totalCount, onClick, offset }) {
  const buttonsNumber = Math.ceil(totalCount / limit)

  const buttons = []

  for (let i = 1; i <= buttonsNumber; i++) {
    const pageOptions = {
      i,
      limit,
      offset: i * limit - limit
    }

    buttons.push(pageOptions)
  }

  return (
    <div id="page-buttons-area">
      {buttons.map(button => {
        return (
          <button
            key={button.i}
            disabled={button.offset === offset}
            onClick={() => onClick({ limit: button.limit, offset: button.offset })}
          >
            {button.i}
          </button>
        )
      })}
    </div>
  )
}

PageButtons.propTypes = {
  onClick: PropTypes.func.isRequired,
  limit: PropTypes.number.isRequired,
  totalCount: PropTypes.number.isRequired,
  offset: PropTypes.number.isRequired
}

export default PageButtons

export default function PageButtonsCreator({limit, totalCount, onClick, pageOffset}) {

  const buttonsNumber = Math.ceil(totalCount/limit)

  const buttons = []

  for (let i = 1; i <= buttonsNumber; i++) {

    const pageOptions = {
      i,
      limit,
      offset: i * limit - limit
    }

    buttons.push(pageOptions)
  }

  const offset = pageOffset

  const disableActiveButton = (button) => {

    if (button.offset === offset) {
      return true
    }
    return false
  }

  return (
    <div id="page-buttons-area">
      {buttons.map(button => {
        return (
          <button key={button.i} disabled={disableActiveButton(button)} onClick={() => onClick({limit: button.limit, offset: button.offset})}>{button.i}</button>
        )
      })}
    </div>
  )
}

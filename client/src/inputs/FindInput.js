export default function FindInput({onChange}) {

  return (
    <div className="input-line input-find">
      <input type="text" id="search" onChange={event => onChange(event.target.value)} />
    </div>
  )
}
export default function CreateTitleInput({value, onChange}) {

  return (
    <div className="input-line">
      <input type="text" id="title" value={value} onChange={event => onChange({title: event.target.value})} />
    </div>
  )
}
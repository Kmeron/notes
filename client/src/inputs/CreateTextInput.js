export default function CreateTextInput({value, onChange}) {

  return (
    <div className="input-line">
      <textarea type="text" id="text" value={value} onChange={event => onChange({text: event.target.value})} />
    </div>
  )
}
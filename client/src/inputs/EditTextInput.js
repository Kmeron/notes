export default function EditTextInput({value, onChange}) {

  return (
    <input type="text" value={value} onChange={event => onChange({text: event.target.value})} />
  )
}
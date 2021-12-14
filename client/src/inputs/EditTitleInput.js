export default function EditTitleInput({value, onChange}) {

  return (
    <input type="text" value={value} onChange={event => onChange({title: event.target.value})} />
  )
}
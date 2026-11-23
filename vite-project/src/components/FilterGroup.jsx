export default function FilterGroup({ title, options, selected = [], onChange }) {
  return (
    <fieldset className="filter-group">
      <legend>{title}</legend>
      {options.map((option) => (
        <label className="filter-option" key={option.value}>
          <input
            type="checkbox"
            value={option.value}
            checked={selected.includes(option.value)}
            onChange={() => onChange(option.value)}
          />
          <span className="custom-checkbox" aria-hidden="true" />
          <span>{option.text}</span>
        </label>
      ))}
    </fieldset>
  )
}

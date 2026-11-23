import { useState } from 'react'

export default function ProductOptions({ label, options, type = 'text', shape = 'square' }) {
  const [selected, setSelected] = useState(options[0])

  return (
    <fieldset className="product-options">
      <legend>{label}</legend>
      <div className="product-options__list">
        {options.map((option) => (
          <button
            className={`option-chip option-chip--${shape}${selected === option ? ' option-chip--selected' : ''}`}
            key={option}
            type="button"
            aria-label={type === 'color' ? `Selecionar cor ${option}` : `Selecionar tamanho ${option}`}
            aria-pressed={selected === option}
            onClick={() => setSelected(option)}
            style={type === 'color' ? { '--option-color': option } : undefined}
          >
            {type === 'text' ? option : <span className="color-dot" />}
          </button>
        ))}
      </div>
    </fieldset>
  )
}

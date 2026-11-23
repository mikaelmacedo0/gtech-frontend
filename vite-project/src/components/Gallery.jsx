import { useState } from 'react'

export default function Gallery({ images, showThumbs = false, alt = 'Imagem do produto' }) {
  const [active, setActive] = useState(0)
  const previous = () => setActive((index) => Math.max(0, index - 1))
  const next = () => setActive((index) => Math.min(images.length - 1, index + 1))

  return (
    <div className="gallery">
      <div className="gallery__stage">
        <img src={images[active]} alt={`${alt} ${active + 1}`} />
        <button className="gallery-arrow gallery-arrow--left" onClick={previous} disabled={active === 0} aria-label="Imagem anterior">←</button>
        <button className="gallery-arrow gallery-arrow--right" onClick={next} disabled={active === images.length - 1} aria-label="Próxima imagem">→</button>
        <span className="gallery-counter">{String(active + 1).padStart(2, '0')} / {String(images.length).padStart(2, '0')}</span>
      </div>
      {showThumbs && (
        <div className="gallery__thumbs">
          {images.map((image, index) => (
            <button
              key={image}
              className={index === active ? 'gallery-thumb gallery-thumb--active' : 'gallery-thumb'}
              onClick={() => setActive(index)}
              aria-label={`Ver imagem ${index + 1}`}
              aria-pressed={index === active}
            >
              <img src={image} alt="" />
            </button>
          ))}
        </div>
      )}
    </div>
  )
}

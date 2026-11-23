export default function Section({ title, titleAlign = 'left', link, children, className = '' }) {
  return (
    <section className={`content-section ${className}`}>
      <div className={`section-heading section-heading--${titleAlign}`}>
        <h2>{title}</h2>
        {link && <a href={link.href}>{link.text}<span aria-hidden="true"> →</span></a>}
      </div>
      {children}
    </section>
  )
}

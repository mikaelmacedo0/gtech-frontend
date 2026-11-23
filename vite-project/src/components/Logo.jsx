import { Link } from 'react-router-dom'

export default function Logo({ light = false }) {
  return (
    <Link className={`brand${light ? ' brand--light' : ''}`} to="/" aria-label="Drip Store, início">
      <span className="brand__mark" aria-hidden="true">D</span>
      <span className="brand__name">drip<span>.</span>store</span>
    </Link>
  )
}

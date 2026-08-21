import { useEffect, useRef, useState } from 'react'
import { useReducedMotion } from '../../hooks/useReducedMotion.js'

const stats = [[12, '+', 'Years'], [159, '+', 'Clients'], [96, '%', 'Retention'], [45, '+', 'Specialists']]
function Stat({ value, suffix, label }) {
  const ref = useRef(); const reduced = useReducedMotion(); const [shown, setShown] = useState(reduced ? value : 0)
  useEffect(() => { const node = ref.current; const observer = new IntersectionObserver(([entry]) => { if (!entry.isIntersecting) return; observer.disconnect(); if (reduced) return setShown(value); const start = performance.now(); const tick = now => { const progress = Math.min((now-start)/1100, 1); setShown(Math.round(value * (1 - Math.pow(1-progress, 3)))); if (progress < 1) requestAnimationFrame(tick) }; requestAnimationFrame(tick) }, { threshold: .5 }); observer.observe(node); return () => observer.disconnect() }, [value, reduced])
  return <div ref={ref} className="stat"><strong>{shown}{suffix}</strong><span>{label}</span></div>
}
export default function TrustStats() { return <section className="trust" id="about"><div className="container"><p className="trust-label">Trusted by ambitious brands across the UAE</p><div className="client-row" aria-label="Selected clients"><span>emirates NBD</span><span>EMAAR</span><span>Careem</span><span>JUMEIRAH</span><span>noon</span></div><div className="stats-grid">{stats.map(s => <Stat key={s[2]} value={s[0]} suffix={s[1]} label={s[2]} />)}</div></div></section> }

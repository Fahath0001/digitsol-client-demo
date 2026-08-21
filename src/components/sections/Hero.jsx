import { useEffect, useState } from 'react'
import { ArrowDownRight } from 'lucide-react'
import ExploreButton3D from '../three/ExploreButton3D'

const slides = [
  ['Strategy built to move businesses', 'forward.', 'Clear positioning, sharper priorities and a practical path to measurable growth.', '#009c95'],
  ['Brands designed to be', 'remembered.', 'Distinctive identities and campaigns created to earn attention and build lasting value.', '#ff6b16'],
  ['Web experiences made to', 'perform.', 'Fast, intuitive digital experiences that turn visits into meaningful action.', '#f9b62b'],
  ['Mobile products people come', 'back to.', 'Useful, polished applications designed around real people and everyday needs.', '#ff6b16'],
  ['Campaigns that turn attention into', 'growth.', 'Connected social content and paid media that build demand and move audiences.', '#f9b62b'],
  ['Performance built beyond the next', 'click.', 'Search and acquisition programs accountable to conversion, revenue and momentum.', '#009c95'],
]

export default function Hero() {
  const [active, setActive] = useState(0)
  useEffect(() => { const sync=event=>setActive(event.detail);window.addEventListener('digitsol-journey-active',sync);return()=>window.removeEventListener('digitsol-journey-active',sync) },[])
  const [headline, accent, description] = slides[active]
  return <section className="hero" id="top"><div className="container hero-grid"><div className="hero-copy reveal"><p className="eyebrow">DUBAI · 360° DIGITAL AGENCY</p><div className="hero-slide" key={active}><h1>{headline} <em>{accent}</em></h1><p>{description}</p></div><div className="hero-actions"><a className="explore-cube-button" href="#work" aria-label="Explore Our Works"><span className="explore-canvas" aria-hidden="true"><ExploreButton3D active={active} /></span></a></div></div><div className="scene-wrap hero-service-anchor" aria-hidden="true" /></div><div className="container scroll-cue"><span>SCROLL TO DISCOVER</span><ArrowDownRight /></div></section>
}

import { lazy, Suspense } from 'react'
import { ArrowUpRight } from 'lucide-react'
import { services } from '../../data/siteData.js'
import SectionHeading from '../ui/SectionHeading.jsx'

const ServiceIcon3D = lazy(() => import('../three/ServiceIcon3D.jsx'))
const accentColors = { teal:'#009c95', orange:'#ff6b16', yellow:'#f9b62b' }

function ServiceCard({ item, index, active }) {
  const move = e => { if (matchMedia('(pointer: coarse)').matches) return; const r=e.currentTarget.getBoundingClientRect(); e.currentTarget.style.transform=`perspective(700px) rotateX(${-(e.clientY-r.top-r.height/2)/35}deg) rotateY(${(e.clientX-r.left-r.width/2)/35}deg) translateY(-6px)` }
  return <article className={`service-card reveal-card ${active ? 'service-active' : ''}`} style={{'--active-color':accentColors[item.accent]}} onPointerMove={move} onPointerLeave={e => e.currentTarget.style.transform=''} tabIndex="0"><div className="service-icon service-icon-webgl" role="img" aria-label={`${item.title} 3D icon`}><Suspense fallback={null}><ServiceIcon3D type={item.title} accent={item.accent} active={active}/></Suspense></div><span className="card-index">0{index+1}</span><h3>{item.title}</h3><p>{item.text}</p><a href="#audit" aria-label={`Learn about ${item.title}`}>Explore <ArrowUpRight /></a></article>
}
export default function Services() {
  return <section className="section services" id="services"><div className="container services-layout"><div className="services-intro"><SectionHeading eyebrow="WHAT WE DO" title="Everything your brand needs to grow." /><div className="service-drop-zone" aria-label="3D model destination" /></div><div className="services-grid">{services.map((item,i) => <ServiceCard key={item.title} item={item} index={i} active={false} />)}</div></div></section>
}

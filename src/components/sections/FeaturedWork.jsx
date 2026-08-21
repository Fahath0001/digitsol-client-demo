import { useRef, useState } from 'react'
import { ArrowRight } from 'lucide-react'
import { projects } from '../../data/siteData.js'
import SectionHeading from '../ui/SectionHeading.jsx'

const projectVideos = [
  '/videos/fintech-banking-5sec.mp4',
  '/videos/luxury-hospitality-5sec.mp4',
  '/videos/luxury-product-5sec.mp4',
]

function ProjectCard({ project, index }) {
  const video = useRef(null)
  const [previewReady, setPreviewReady] = useState(false)
  const play = () => video.current?.play().catch(() => {})
  const reset = () => {
    if (!video.current) return
    video.current.pause()
    video.current.currentTime = 0.35
  }
  const showFirstFrame = () => {
    if (!video.current) return
    video.current.pause()
    video.current.currentTime = 0.35
  }

  return <article className={`project-card reveal-card ${index === 0 ? 'wide' : ''}`} tabIndex="0" onMouseEnter={play} onMouseLeave={reset} onFocus={play} onBlur={reset}><div className={`project-visual ${project.theme}`}><video className={previewReady ? 'preview-ready' : ''} ref={video} src={projectVideos[index]} muted loop playsInline preload="auto" onLoadedData={showFirstFrame} onSeeked={() => setPreviewReady(true)} aria-label={`${project.title} project preview`}/></div><div><p>{project.category}</p><h3>{project.title}</h3><ArrowRight /></div></article>
}

export default function FeaturedWork() {
  return <section className="section work" id="work"><div className="container"><div className="heading-row"><SectionHeading eyebrow="SELECTED WORK" title="Ideas transformed into measurable impact." /><a href="#work" className="text-link">View All Case Studies <ArrowRight /></a></div><div className="project-grid">{projects.map((project, index) => <ProjectCard project={project} index={index} key={project.title}/>)}</div></div></section>
}

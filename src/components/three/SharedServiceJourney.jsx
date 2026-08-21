import { lazy, Suspense, useEffect, useRef, useState } from 'react'
import gsap from 'gsap'
import { services } from '../../data/siteData.js'

const ServiceIcon3D = lazy(() => import('./ServiceIcon3D.jsx'))

const mix = (from, to, progress) => from + (to - from) * progress

export default function SharedServiceJourney() {
  const frame = useRef()
  const element = useRef()
  const atEndpoint = useRef(true)
  const journeyProgress = useRef(0)
  const [active, setActive] = useState(0)

  useEffect(() => { window.dispatchEvent(new CustomEvent('digitsol-journey-active', { detail:active })) }, [active])

  useEffect(() => {
    const choose = setInterval(() => setActive(current => atEndpoint.current && journeyProgress.current <= .02 ? (current + 1) % services.length : current), 5000)
    return () => clearInterval(choose)
  }, [])

  useEffect(() => {
    let moveX
    let moveY
    let resizeWidth
    let resizeHeight
    let rotate
    let settle
    let lastScroll = window.scrollY
    let initialized = false
    const update = () => {
      frame.current = 0
      const source = document.querySelector('.hero-service-anchor')?.getBoundingClientRect()
      const destination = document.querySelector('.service-drop-zone')?.getBoundingClientRect()
      const section = document.querySelector('.services')?.getBoundingClientRect()
      if (!source || !destination || !section || !element.current) return
      const start = window.innerHeight * .92
      const end = window.innerHeight * .3
      const progress = Math.min(Math.max((start - section.top) / (start - end), 0), 1)
      journeyProgress.current = progress
      atEndpoint.current = progress <= .02 || progress >= .98
      const x = mix(source.left, destination.left, progress)
      const y = mix(source.top, destination.top, progress)
      const width = mix(source.width, destination.width, progress)
      const height = mix(source.height, destination.height, progress)
      if (!initialized) {
        gsap.set(element.current,{x,y,width,height,rotation:0})
        moveX=gsap.quickTo(element.current,'x',{duration:.5,ease:'power3.out'})
        moveY=gsap.quickTo(element.current,'y',{duration:.5,ease:'power3.out'})
        resizeWidth=gsap.quickTo(element.current,'width',{duration:.5,ease:'power3.out'})
        resizeHeight=gsap.quickTo(element.current,'height',{duration:.5,ease:'power3.out'})
        rotate=gsap.quickTo(element.current,'rotation',{duration:.32,ease:'power2.out'})
        initialized=true
      } else {
        const scrollDelta=window.scrollY-lastScroll
        moveX(x);moveY(y);resizeWidth(width);resizeHeight(height);rotate(Math.max(-4,Math.min(4,scrollDelta*.12)))
        clearTimeout(settle)
        settle=setTimeout(()=>rotate(0),100)
      }
      lastScroll=window.scrollY
    }
    const schedule = () => { if (!frame.current) frame.current = requestAnimationFrame(update) }
    update()
    window.addEventListener('scroll', schedule, { passive:true })
    window.addEventListener('resize', schedule)
    return () => { if (frame.current) cancelAnimationFrame(frame.current);clearTimeout(settle);gsap.killTweensOf(element.current);window.removeEventListener('scroll', schedule);window.removeEventListener('resize', schedule) }
  }, [])

  const item = services[active]
  return <div ref={element} className="shared-service-journey" role="img" aria-label={`${item.title} animated 3D service model`}><Suspense fallback={null}><ServiceIcon3D type={item.title} accent={item.accent} active featured hero journey /></Suspense></div>
}

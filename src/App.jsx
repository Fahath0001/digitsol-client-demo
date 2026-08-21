import gsap from 'gsap'
import { ScrollTrigger } from 'gsap/ScrollTrigger'
import { useGSAP } from '@gsap/react'
import Header from './components/layout/Header.jsx'
import Footer from './components/layout/Footer.jsx'
import Hero from './components/sections/Hero.jsx'
import TrustStats from './components/sections/TrustStats.jsx'
import Services from './components/sections/Services.jsx'
import FeaturedWork from './components/sections/FeaturedWork.jsx'
import Process from './components/sections/Process.jsx'
import Results from './components/sections/Results.jsx'
import Audit from './components/sections/Audit.jsx'
import Insights from './components/sections/Insights.jsx'
import FinalCTA from './components/sections/FinalCTA.jsx'
import SharedServiceJourney from './components/three/SharedServiceJourney.jsx'

gsap.registerPlugin(ScrollTrigger, useGSAP)
export default function App(){useGSAP(()=>{if(matchMedia('(prefers-reduced-motion: reduce)').matches)return;gsap.from('.hero-copy > *',{y:34,opacity:0,duration:.9,stagger:.1,ease:'power3.out'});gsap.utils.toArray('.section-heading').forEach(el=>gsap.from(el.children,{scrollTrigger:{trigger:el,start:'top 86%',once:true},y:32,opacity:0,duration:.72,stagger:.1,ease:'power3.out'}));gsap.utils.toArray('.reveal-card').forEach(el=>gsap.from(el,{scrollTrigger:{trigger:el,start:'top 88%',once:true},y:44,opacity:0,scale:.98,duration:.75,ease:'power3.out'}));gsap.utils.toArray('.reveal').slice(1).forEach(el=>gsap.from(el,{scrollTrigger:{trigger:el,start:'top 85%',once:true},y:36,opacity:0,duration:.85}));gsap.utils.toArray('.project-visual').forEach(el=>gsap.to(el,{scrollTrigger:{trigger:el,start:'top bottom',end:'bottom top',scrub:1.2},backgroundPosition:'50% 75%',yPercent:4,ease:'none'}));gsap.from('.process-line',{scrollTrigger:{trigger:'.process-track',start:'top 75%',once:true},scaleX:0,transformOrigin:'left',duration:1.3,ease:'power2.out'});gsap.from('.process-step',{scrollTrigger:{trigger:'.process-track',start:'top 76%',once:true},y:28,opacity:0,duration:.65,stagger:.18,ease:'power2.out'});gsap.from('.results svg path',{scrollTrigger:{trigger:'.metric-grid',start:'top 80%',once:true},strokeDashoffset:200,duration:1.5,stagger:.15});gsap.to('.audit-lens',{rotation:8,y:-10,duration:3.2,repeat:-1,yoyo:true,ease:'sine.inOut'});gsap.to('.audit-art > span',{y:-14,rotation:18,duration:2.4,repeat:-1,yoyo:true,stagger:.3,ease:'sine.inOut'});gsap.to('.cta-shape',{rotation:'+=25',y:12,duration:5,repeat:-1,yoyo:true,stagger:.5,ease:'sine.inOut'})},{scope:document.body});return <><div className="site-experience"><Header/><main><Hero/><TrustStats/><Services/><FeaturedWork/><Process/><Results/><Audit/><Insights/><FinalCTA/></main><SharedServiceJourney/><Footer/></div><div className="desktop-only-message"><span className="logo-mark" aria-hidden="true"><i/><i/><i/></span><h1>Best viewed on desktop</h1><p>This experience is designed for desktop and laptop screens 1240px wide or larger.</p></div></>}

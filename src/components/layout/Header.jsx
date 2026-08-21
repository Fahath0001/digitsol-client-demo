import { useEffect, useState } from 'react'
import { ArrowRight, Menu, X } from 'lucide-react'
import Logo from './Logo.jsx'

const links = [['About', '#about'], ['Services', '#services'], ['Case Studies', '#work'], ['Insights', '#insights']]

export default function Header() {
  const [open, setOpen] = useState(false)
  useEffect(() => {
    document.body.style.overflow = open ? 'hidden' : ''
    const close = (event) => event.key === 'Escape' && setOpen(false)
    window.addEventListener('keydown', close)
    return () => { document.body.style.overflow = ''; window.removeEventListener('keydown', close) }
  }, [open])
  return <header className="site-header"><div className="container header-inner"><Logo /><nav className="desktop-nav" aria-label="Primary">{links.map(([label, href]) => <a key={href} href={href}>{label}</a>)}</nav><a href="#audit" className="button button-dark desktop-cta">Start a Project <ArrowRight /></a><button className="menu-button" onClick={() => setOpen(!open)} aria-expanded={open} aria-controls="mobile-nav" aria-label={open ? 'Close navigation' : 'Open navigation'}>{open ? <X /> : <Menu />}</button></div><nav id="mobile-nav" className={`mobile-nav ${open ? 'open' : ''}`} aria-label="Mobile">{links.map(([label, href]) => <a key={href} href={href} onClick={() => setOpen(false)}>{label}</a>)}<a href="#audit" className="button button-dark" onClick={() => setOpen(false)}>Start a Project</a></nav></header>
}
